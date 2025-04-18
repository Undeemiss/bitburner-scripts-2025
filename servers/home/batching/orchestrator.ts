import { Server } from "@/NetscriptDefinitions";

const absMaxBatches = 100000;

function getBatchThreads(ns: NS, targetStealRatio: number, targetHostname: string) {
    // Get an idealized version of the target server
    const target = ns.getServer(targetHostname);
    target.hackDifficulty = target.minDifficulty;

    // Get relevant constants
    const player = ns.getPlayer();
    const weakenEffect = ns.weakenAnalyze(1);

    // Get hackThreads amount
    const threadHackPercent = ns.formulas.hacking.hackPercent(target, player);
    const absMaxHackThreads = Math.ceil(1 / threadHackPercent);
    const hackThreads = Math.min(Math.ceil(targetStealRatio / threadHackPercent), absMaxHackThreads);
    const stealRatio = Math.min(1, hackThreads * threadHackPercent);

    target.moneyAvailable = Math.max(0, target.moneyMax * (1 - stealRatio));
    const growThreads = ns.formulas.hacking.growThreads(target, player, target.moneyMax);

    // Calculate the number of weaken threads required to balance out each operation.
    const hackWeakens = Math.ceil((hackThreads * 0.002) / weakenEffect);
    const growWeakens = Math.ceil((growThreads * 0.004) / weakenEffect);

    const totalThreads = hackThreads + hackWeakens + growThreads + growWeakens;
    return [totalThreads, stealRatio, [hackThreads, hackWeakens, growThreads, growWeakens]];
}

