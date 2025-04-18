import { AutocompleteData, Player, Server } from "@/NetscriptDefinitions";
import { getMaxThreads, execOnBotnet } from "../utils/botnet";
import { getHosts } from "../utils/getHosts";

const wakeupTimer = 100;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    // Initialize parameters for the script
    let botnet = getHosts(ns);
    if (!ns.args[0]) {
        botnet.delete('home');
    }
    let target = ns.getServer('joesguns');

    // Start Batching
    await expGrow(ns, target.hostname, botnet);
}

async function expGrow(ns: NS, targetHostname: string, botnet: Set<string>) {
    // Initialize variables
    let target: Server;
    let player: Player;
    const weakenEffectiveness = ns.weakenAnalyze(1);
    const weakensPerGrow = 0.004 / weakenEffectiveness;
    const efficiencyFactor = (1 / (1 + weakensPerGrow));

    // Grow for xp forever.
    while (true) {
        // Ensure accurate data for formulas
        target = ns.getServer(targetHostname);
        player = ns.getPlayer();

        // Calculate how many grow/weaken threads to use with available RAM
        const availableThreads = getMaxThreads(ns, botnet, 1.75);
        const growThreads = Math.floor(availableThreads * efficiencyFactor);
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
            await ns.sleep(weakenTime);
        } else {
            ns.print(`No RAM to grind EXP! Sleeping...\n${ns.tFormat(wakeupTimer)}`);
            await ns.sleep(wakeupTimer);
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return ['--tail'];
}