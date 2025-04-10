/** @param {NS} ns */
export async function main(ns: NS) {
    ns.tprint(getHosts(ns));
}

export function getHosts(ns: NS){
    const knownHosts = new Set<string>();
    knownHosts.add("home");
    const toSearch = ["home"];

    while (toSearch.length > 0) {
        const hostname = toSearch.pop();
        const scanResults = ns.scan(hostname);
        for (const scannedHost of scanResults) {
            if (!knownHosts.has(scannedHost)) {
                toSearch.push(scannedHost);
            }
            knownHosts.add(scannedHost);
        }
    }

    return knownHosts;
}