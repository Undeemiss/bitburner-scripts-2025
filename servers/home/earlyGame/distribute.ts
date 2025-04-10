import { getHosts } from "../utils/getHosts";
import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    const hosts = getHosts(ns);
    const toDistribute: string = <string>ns.args[0];

    for (const host of hosts) {
        const server = ns.getServer(host);
        if (server.hasAdminRights) {
            ns.scp(toDistribute, host);
            const threads = Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam(toDistribute));
            if (threads > 0) {
                ns.exec(toDistribute, host, threads);
            }
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}