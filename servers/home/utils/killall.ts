import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const hosts = getHosts(ns, true, true);
    for (const host of hosts) {
        ns.killall(host, true);
    }
}