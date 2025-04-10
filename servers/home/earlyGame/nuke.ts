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

    for (const host of knownHosts) {
        try {
            ns.brutessh(host);
            ns.ftpcrack(host);
            ns.relaysmtp(host);
            ns.httpworm(host);
            ns.sqlinject(host);
        } catch (e) {

        }
        try {
            ns.nuke(host);
        } catch (e) {

        }
    }
}