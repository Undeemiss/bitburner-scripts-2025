import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const knownHosts = getHosts(ns, true);

    let totalRam = 0;
    let controlledRam = 0;
    let freeRam = 0;
    for (const host of knownHosts) {
        const server = ns.getServer(host);
        if (server.hasAdminRights) {
            controlledRam += server.maxRam;
            freeRam += server.maxRam - server.ramUsed;
        }
        totalRam += server.maxRam;
    }
    ns.tprint(`\nTotal Ram: ${totalRam}\nControlled RAM: ${controlledRam}\nFree Ram: ${freeRam}`);
}