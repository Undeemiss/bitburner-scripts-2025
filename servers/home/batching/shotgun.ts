import { AutocompleteData, Server } from "@/NetscriptDefinitions";
import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    // Initialize parameters for the script
    let target = ns.getServer(<string>ns.args[0]);
    let botnet = getHosts(ns);
    let maxAttacks = 10;
    let player = ns.getPlayer();

    // TODO
    // Start softening the target.
    // Start Batching. This can be done immediately, without waiting,
    // if there is RAM left over after assigning the final softening threads.

}

async function soften(ns: NS, targetHostname: string) {
    const target = ns.getServer(targetHostname);
    const player = ns.getPlayer();
    const weakenFactor = ns.weakenAnalyze(1);

    // const initialWeakenThreads = weakenThreads(target, weakenFactor);
    // let growThreads = ns.formulas.hacking.growThreads(target, player, target.moneyMax);
    // let growBalanceThreads = balanceThreads(growThreads, 0, weakenFactor);
    
    // TODO
}

// Get the number of weaken threads required to minimize server security.
function weakenThreads(target: Server, weakenFactor: number) {
    return Math.ceil(target.hackDifficulty - target.minDifficulty / weakenFactor);
}

// Get the number of weaken threads required to offset a number of grow or hack threads.
// Combined simply because this offers greater flexibility.
function balanceThreads(growThreads: number, hackThreads: number, weakenFactor: number) {
    return Math.ceil(((growThreads * 0.004) + (hackThreads * 0.002) / weakenFactor))
}

function balanceRatio(weakenFactor: number) {
    return (0.002 / weakenFactor)
}
function growBalance(growThreads: number, weakenFactor: number) {
    return Math.ceil(growThreads * 2 * balanceRatio(weakenFactor))
}
function hackBalance(hackThreads: number, weakenFactor: number) {
    return Math.ceil(hackThreads * balanceRatio(weakenFactor))
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}