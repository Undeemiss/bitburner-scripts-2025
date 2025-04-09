/** @param {NS} ns */
export async function main(ns: NS) {
    ns.ui.openTail();

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
    ns.print(knownHosts);

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
    ns.print(`Total Ram: ${totalRam}\nControlled RAM: ${controlledRam}\nFree Ram: ${freeRam}`);
}