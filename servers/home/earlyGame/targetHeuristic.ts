import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const hosts = getHosts(ns);

    const stats = [];
    for (const host of hosts) {
        const server = ns.getServer(host);
        if (server.hasAdminRights) {
            const levelRatio = ns.getServerRequiredHackingLevel(host) / ns.getHackingLevel();
            if (levelRatio <= 1) {
                const profitRatio = server.moneyMax / server.minDifficulty;
                if (profitRatio > 0) {
                    stats.push([host, levelRatio, profitRatio]);
                }
            }
        }
    }
    stats.sort((a, b) => a[2] - b[2]);
    for (const stat of stats) {
        ns.tprint(`${stat[2].toExponential(2)} / ${stat[1].toFixed(2).padStart(4, '0')} - ${stat[0]}`);
    }
}