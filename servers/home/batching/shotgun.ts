import { AutocompleteData, Server } from "@/NetscriptDefinitions";
import { getHosts } from "../utils/getHosts";
import { getMaxThreads, execOnBotnet } from "../utils/botnet";

const sleepBuffer = 100;
const wakeupTimer = 10000;

/** @param {NS} ns */
export async function main(ns: NS) {
    // Initialize parameters for the script
    let target = ns.getServer(<string>ns.args[0]);
    let botnet = getHosts(ns);

    // TODO
    await soften(ns, target.hostname, botnet);
    // Start Batching. This can be done immediately, without waiting,
    // if there is RAM left over after assigning the final softening threads.

}

// Prepares a server for batching. Returns once the last operation is started,
// not when it finishes, enabling extra RAM to be used for batching straight away.
async function soften(ns: NS, targetHostname: string, botnet: Set<string>) {
    await initialWeaken(ns, targetHostname, botnet);
    await initialGrow(ns, targetHostname, botnet);
}

async function initialWeaken(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    const target = ns.getServer(targetHostname);
    const player = ns.getPlayer();
    const weakenEffectiveness = ns.weakenAnalyze(1);

    // Weaken until the security is minimized
    let weakenThreadsRemaining = Math.ceil((target.hackDifficulty - target.minDifficulty) / weakenEffectiveness);
    while (weakenThreadsRemaining > 0) {
        const returned = execOnBotnet(ns, botnet, 'batching/weaken.js', weakenThreadsRemaining, [targetHostname]);

        // Sleep if more weakening is required
        if (returned > 0) {
            if (returned == weakenThreadsRemaining) { // Wait briefly if no RAM was available
                await ns.sleep(wakeupTimer);
            } else { // Wait until the operation completes if some, but not all, of the threads were fulfilled
                weakenThreadsRemaining = returned;
                await ns.sleep(sleepBuffer + ns.formulas.hacking.weakenTime(target, player));
            }
        }
    }
}

async function initialGrow(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    const target = ns.getServer(targetHostname);
    const player = ns.getPlayer();
    const weakenEffectiveness = ns.weakenAnalyze(1);
    const weakensPerGrow = 2 * balanceRatio(weakenEffectiveness);
    const efficiencyFactor = (1 / (1 + weakensPerGrow));

    // Grow until the server is completely full
    let growThreadsRemaining = ns.formulas.hacking.growThreads(target, player, target.moneyMax);
    while (growThreadsRemaining > 0) {
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
                await ns.sleep(sleepBuffer + weakenTime);
            }

        } else { // Wait breifly if not enough RAM is available
            await ns.sleep(wakeupTimer);
        }
    }
}

// Get the number of weaken threads required to minimize server security.
function weakenThreads(target: Server, weakenEffectiveness: number) {
    return Math.ceil(target.hackDifficulty - target.minDifficulty / weakenEffectiveness);
}

// Get the number of weaken threads required to offset a number of grow or hack threads.
// Combined simply because this offers greater flexibility.
function balanceThreads(growThreads: number, hackThreads: number, weakenEffectiveness: number) {
    return Math.ceil(((growThreads * 0.004) + (hackThreads * 0.002) / weakenEffectiveness))
}

function balanceRatio(weakenEffectiveness: number) {
    return (0.002 / weakenEffectiveness)
}
function growBalance(growThreads: number, weakenEffectiveness: number) {
    return Math.ceil(growThreads * 2 * balanceRatio(weakenEffectiveness))
}
function hackBalance(hackThreads: number, weakenEffectiveness: number) {
    return Math.ceil(hackThreads * balanceRatio(weakenEffectiveness))
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}