import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    switch (ns.args[0]) {
        case 'farConnect': farConnect(ns, <string>ns.args[1]); break;
        default: ns.tprint(getHosts(ns)); break;
    }
}

export function getHosts(ns: NS, includeHome: boolean = false, includeHacknet: boolean = false) {
    let knownHosts = new Set<string>();
    knownHosts.add("home");
    const toSearch = ["home"];

    while (toSearch.length > 0) {
        const hostname = toSearch.pop();
        const scanResults = ns.scan(hostname);
        for (const scannedHost of scanResults) {
            // Hacknet server exclusion
            if (!includeHacknet && scannedHost.startsWith('hacknet-server-')) {
                continue;
            }

            if (!knownHosts.has(scannedHost)) {
                toSearch.push(scannedHost);
            }
            knownHosts.add(scannedHost);
        }
    }

    if (!includeHome) {
        knownHosts.delete('home');
    }

    return knownHosts;
}

export function getPath(ns: NS, hostname: string, maxDepth: number = 100) {
    // Infinite loop prevention
    if (maxDepth < 0) {
        throw new Error('No path found from home');
    }

    // Base case
    if (hostname == 'home') {
        return ['home'];
    }

    return [...getPath(ns, ns.scan(hostname)[0], maxDepth - 1), hostname];
}

export function farConnect(ns: NS, hostname: string) {
    const path = getPath(ns, hostname);
    for (const link of path) {
        const returnCode = ns.singularity.connect(link);
        if (returnCode == false) {
            throw new Error(`Could not connect to server '${link}' on path to '${hostname}'`);
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail', 'farConnect'];
}