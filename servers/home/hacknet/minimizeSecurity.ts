/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    const target = <string>ns.args[0];
    let security = ns.getServerMinSecurityLevel(target);

    while (security > 1) {
        // Buy min security decreases repeatedly
        while (ns.hacknet.spendHashes('Reduce Minimum Security', target, 1) && security > 1) {
            security = ns.getServerMinSecurityLevel(target);
        }

        ns.print(security);
        await ns.sleep(10000);
    }
}