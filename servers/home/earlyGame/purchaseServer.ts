import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const size = <number>eval(<string>ns.args[0])
    // Print the cost
    ns.tprint(ns.formatNumber(ns.getPurchasedServerCost(size)));

    // If a name was given, buy the server
    for (let i = 0; i < Math.min(ns.getPurchasedServerLimit(), <number>ns.args[1]); i++) {
        ns.tprint(ns.purchaseServer(`server-${i}`, size));
    }
}
