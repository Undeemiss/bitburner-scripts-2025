import { getHosts } from "../utils/getHosts";
import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    const hosts = getHosts(ns, true);
    const toDistribute = <string>ns.args[1];
    let requestedAmt = <number>ns.args[0];
    if (requestedAmt == 0) {
        requestedAmt = Infinity;
    }

    for (const host of hosts) {
        const server = ns.getServer(host);
        if (server.hasAdminRights) {
            ns.scp(toDistribute, host);
            let threads = Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam(toDistribute));
            threads = Math.min(requestedAmt, threads);
            if (threads > 0) {
                ns.exec(toDistribute, host, threads, ...ns.args.slice(2));
            }
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return [...data.scripts, ...data.servers, '--tail'];
}