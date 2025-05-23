import { AutocompleteData } from "@/NetscriptDefinitions";
import { getMaxThreads, execOnBotnet } from "../utils/botnet";

const sleepBuffer = 1000;
const wakeupTimer = 10000;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    // Initialize parameters for the script
    let target = ns.getServer(<string>ns.args[1]);
    // let botnet = getHosts(ns);
    let botnet = new Set<string>([<string>ns.args[0]]);

    // Start Batching
    await soften(ns, target.hostname, botnet);
    await batch(ns, target.hostname, botnet);
}


async function batch(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    const weakenEffectiveness = ns.weakenAnalyze(1);
    const weakensPerHack = balanceRatio(weakenEffectiveness);
    const weakensPerGrow = 2 * balanceRatio(weakenEffectiveness);

    while (true) {
        // Get basic server information
        const target = ns.getServer(targetHostname);
        const player = ns.getPlayer();
        const projectedTarget = JSON.parse(JSON.stringify(target)); // This makes a deep copy

        const threadsAvailable = getMaxThreads(ns, botnet, 1.75);

        // Calculate how many hack threads are necessary to drain the target completely
        projectedTarget.hackDifficulty = target.minDifficulty; // This affects hack/grow amount at completion
        // TODO: Account for hacking skill level ups
        const threadHackPercent = ns.formulas.hacking.hackPercent(projectedTarget, player)
        const absMaxHackThreads = Math.ceil(1 / threadHackPercent);

        const hackThreads = Math.ceil(absMaxHackThreads * 0.1);
        projectedTarget.moneyAvailable = Math.max(0, target.moneyMax * (1 - (hackThreads * threadHackPercent)));
        const growThreads = ns.formulas.hacking.growThreads(projectedTarget, player, target.moneyMax);
        const hackWeakens = Math.ceil(hackThreads * weakensPerHack);
        const growWeakens = Math.ceil(growThreads * weakensPerGrow);
        const threadsPerBatch = hackThreads + hackWeakens + growThreads + growWeakens;

        const batches = Math.min(Math.floor(threadsAvailable / threadsPerBatch), 100000);

        const weakenTime = ns.formulas.hacking.weakenTime(target, player);
        const hackDeltaTime = weakenTime - ns.formulas.hacking.hackTime(target, player);
        const growDeltaTime = weakenTime - ns.formulas.hacking.growTime(target, player);

        for (let i = 0; i < batches; i++) {
            let failed = 0;
            failed += execOnBotnet(ns, botnet, 'batching/hack.js', hackThreads, [targetHostname, hackDeltaTime]);
            failed += execOnBotnet(ns, botnet, 'batching/weaken.js', hackWeakens, [targetHostname]);
            failed += execOnBotnet(ns, botnet, 'batching/grow.js', growThreads, [targetHostname, growDeltaTime]);
            failed += execOnBotnet(ns, botnet, 'batching/weaken.js', growWeakens, [targetHostname]);
            if (failed != 0) {
                throw Error(`Failed to allocate ${failed} requested batching threads.`);
            }
        }

        if (batches > 0) {
            ns.print(`Batching (${batches} batches)...\n${ns.tFormat(sleepBuffer + weakenTime)}`);
            await ns.sleep(sleepBuffer + weakenTime);
        } else {
            ns.print(`No RAM to Batch! Sleeping...\n${ns.tFormat(wakeupTimer)}`);
            await ns.sleep(wakeupTimer);
        }
    }
}

// Prepares a server for batching. Returns once the last operation is started,
// not when it finishes, enabling extra RAM to be used for batching straight away.
async function soften(ns: NS, targetHostname: string, botnet: Set<string>) {
    await initialWeaken(ns, targetHostname, botnet);
    await initialGrow(ns, targetHostname, botnet);
}

async function initialWeaken(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    let target = ns.getServer(targetHostname);
    let player = ns.getPlayer();
    const weakenEffectiveness = ns.weakenAnalyze(1);

    // Weaken until the security is minimized
    const weakenThreads = Math.ceil((target.hackDifficulty - target.minDifficulty) / weakenEffectiveness);
    let weakenThreadsRemaining = weakenThreads;
    while (weakenThreadsRemaining > 0) {
        // Ensure accurate data for formulas
        target = ns.getServer(targetHostname);
        player = ns.getPlayer();

        const returned = execOnBotnet(ns, botnet, 'batching/weaken.js', weakenThreadsRemaining, [targetHostname]);

        // Sleep if more weakening is required
        if (returned > 0) {
            if (returned == weakenThreadsRemaining) { // Wait briefly if no RAM was available
                ns.print(`No RAM to Weaken! Sleeping...\n${ns.tFormat(wakeupTimer)}`);
                await ns.sleep(wakeupTimer);
            } else { // Wait until the operation completes if some, but not all, of the threads were fulfilled
                const sleepTime = sleepBuffer + ns.formulas.hacking.weakenTime(target, player);
                ns.print(`Waiting for more initial weaken (${returned} remaining out of ${weakenThreads} total)...\n${ns.tFormat(sleepTime)}`);
                await ns.sleep(sleepTime);
            }
        }
        weakenThreadsRemaining = returned;
    }
}

async function initialGrow(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    let target = ns.getServer(targetHostname);
    let player = ns.getPlayer();
    const weakenEffectiveness = ns.weakenAnalyze(1);
    const weakensPerGrow = 2 * balanceRatio(weakenEffectiveness);
    const efficiencyFactor = (1 / (1 + weakensPerGrow));

    // Grow until the server is completely full
    let growThreadsRemaining = ns.formulas.hacking.growThreads(target, player, target.moneyMax);
    const totalGrowThreads = growThreadsRemaining;
    while (growThreadsRemaining > 0) {
        // Ensure accurate data for formulas
        target = ns.getServer(targetHostname);
        player = ns.getPlayer();

        // Calculate how many grow/weaken threads to use with available RAM
        const availableThreads = getMaxThreads(ns, botnet, 1.75);
        const growThreads = Math.min(Math.floor(availableThreads * efficiencyFactor), growThreadsRemaining);
        const weakenThreads = Math.ceil(growThreads * weakensPerGrow);

        // If there is enough RAM to grow and weaken, proceed.
        if (weakenThreads > 0) {
            const weakenTime = ns.formulas.hacking.weakenTime(target, player);
            const growDeltaTime = weakenTime - ns.formulas.hacking.growTime(target, player);

            let failed = 0;
            failed += execOnBotnet(ns, botnet, 'batching/grow.js', growThreads, [targetHostname, growDeltaTime]);
            failed += execOnBotnet(ns, botnet, 'batching/weaken.js', weakenThreads, [targetHostname]);
            if (failed != 0) {
                throw Error(`Failed to allocate ${failed} requested grow/weaken threads.`);
            }

            growThreadsRemaining -= growThreads;
            if (growThreadsRemaining > 0) { // Wait until the operation completes if some, but not all, of the threads were fulfilled
                ns.print(`Waiting for more initial grow (${growThreadsRemaining} remaining out of ${totalGrowThreads} total)...\n${ns.tFormat(sleepBuffer + weakenTime)}`);
                await ns.sleep(sleepBuffer + weakenTime);
            }

        } else { // Wait breifly if not enough RAM is available
            ns.print(`No RAM to Grow! Sleeping...\n${ns.tFormat(wakeupTimer)}`);
            await ns.sleep(wakeupTimer);
        }
    }
}

function balanceRatio(weakenEffectiveness: number) {
    return (0.002 / weakenEffectiveness)
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}