import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const size = <number>eval(<string>ns.args[0])
    // Print the cost
    ns.tprint(ns.formatNumber(ns.getPurchasedServerCost(size)));

    // If a name was given, but the server
    if (ns.args[1]) {
        ns.tprint(ns.purchaseServer(<string>ns.args[1], size));
    }
}