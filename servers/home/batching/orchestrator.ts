import { Server } from "@/NetscriptDefinitions";
import { execOnBotnet, getMaxThreads, weakenOnBotnet } from "../utils/botnet";
import { getHosts } from "../utils/getHosts";

const ABS_MAX_BATCHES = 100000;
type HWGWAnalysis = { ramCost: number, stealRatio: number, hackThreads: number, growThreads: number };

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    // Initialize parameters for the script
    let target = ns.getServer(<string>ns.args[0]);
    let botnet = getHosts(ns);

    await initialWeaken(ns, target.hostname, botnet);
    // TODO: Initial grow, batching loop
}

async function initialWeaken(ns: NS, targetHostname: string, botnet: Set<string>) {
    let target = ns.getServer(targetHostname);
    let difficultyOffset = target.hackDifficulty - target.minDifficulty;

    while (difficultyOffset > 0) {
        try {
            weakenOnBotnet(ns, botnet, difficultyOffset, targetHostname);
            difficultyOffset = 0; // If the above didn't error, we had enough RAM.
        }
        catch (e) { // Gracefully catch errors thrown due to insufficient RAM
            try {
                if (!(e.message == 'Insufficient RAM on botnet.')) {
                    throw e;
                }

                // Update the remaining difficultyOffset
                difficultyOffset = e.difficultyOffset;
            } catch (_) {
                throw e;
            }
        }

        // TODO: Status updates
        await ns.sleep(1000);
    }
}

function getIdealBatchSize(ns: NS, targetHostname: string, availableRam: number) {
    // Get an idealized version of the target server
    const target = ns.getServer(targetHostname);
    target.hackDifficulty = target.minDifficulty;
    const player = ns.getPlayer();

    // Get max hack threads
    const threadHackPercent = ns.formulas.hacking.hackPercent(target, player);
    const absMaxHackThreads = Math.ceil(1 / threadHackPercent);

    // Score the batches according to their expected profit
    let bestScore = 0;
    let bestAnalysis: HWGWAnalysis;
    for (let n = absMaxHackThreads; n > 0; n = Math.floor(n * 0.8)) {
        const analysis = analyzeHWGW(ns, n, targetHostname);
        const batches = Math.min(Math.floor(analysis.ramCost / availableRam), ABS_MAX_BATCHES);
        const score = analysis.stealRatio * batches;

        if (score > bestScore) {
            bestScore = score;
            bestAnalysis = analysis;
        }
    }
    return bestAnalysis;
}


// Determine the HWGW ram cost for a given number of hack threads.
function analyzeHWGW(ns: NS, hackThreads: number, targetHostname: string): HWGWAnalysis {
    // Get an idealized version of the target server
    const target = ns.getServer(targetHostname);
    target.hackDifficulty = target.minDifficulty;
    const player = ns.getPlayer(); // TODO: Predict level-ups
    const weakenEffect = ns.weakenAnalyze(1);

    // Get growThreads amount
    const threadHackPercent = ns.formulas.hacking.hackPercent(target, player);
    const stealRatio = Math.min(1, hackThreads * threadHackPercent);
    target.moneyAvailable = Math.max(0, target.moneyMax * (1 - stealRatio));
    const growThreads = ns.formulas.hacking.growThreads(target, player, target.moneyMax);

    // Calculate the number of weaken threads required to balance out each operation.
    const hackWeakens = Math.ceil((hackThreads * 0.002) / weakenEffect);
    const growWeakens = Math.ceil((growThreads * 0.004) / weakenEffect);

    const totalRam = (hackThreads * 1.70) + (hackWeakens + growThreads + growWeakens) * 1.75;
    return { ramCost: totalRam, stealRatio: stealRatio, hackThreads: hackThreads, growThreads: growThreads };
}


function sendHWGWBatches(ns: NS, targetHostname: string, botnet: Set<string>, analysis: HWGWAnalysis) {
    let failedHacks = 0;
    let failedGrows = 0;

    // TODO: Define required parameters for batching below
    let availableRam = getMaxThreads(ns, botnet, 1.75) * 1.75 // TODO: Get actual number
    const batches = Math.min(Math.floor(analysis.ramCost / availableRam), ABS_MAX_BATCHES);

    const hackDifficultyOffset = 0.002 * analysis.hackThreads;
    const growDifficultyOffset = 0.004 * analysis.growThreads;

    const server = ns.getServer(targetHostname);
    const player = ns.getPlayer();
    const weakenTime = ns.formulas.hacking.weakenTime(server, player);
    const hackDeltaTime = weakenTime - ns.formulas.hacking.hackTime(server, player);
    const growDeltaTime = weakenTime - ns.formulas.hacking.growTime(server, player);

    for (let i = 0; i < batches; i++) {
        // TODO: These are called potentially hundreds of thousands of times consecutively, and have a lot of room for optimization.

        failedHacks += execOnBotnet(ns, botnet, 'batching/hack.js', analysis.hackThreads, [targetHostname, hackDeltaTime], false, true);
        weakenOnBotnet(ns, botnet, hackDifficultyOffset, targetHostname);
        failedGrows += execOnBotnet(ns, botnet, 'batching/grow.js', analysis.growThreads, [targetHostname, growDeltaTime], false, true);
        weakenOnBotnet(ns, botnet, growDifficultyOffset, targetHostname);
    }
    if (failedHacks + failedGrows > 0) {
        throw Error(`Failed to allocate ${failedHacks} hack threads and ${failedGrows} grow threads.`);
    }
}