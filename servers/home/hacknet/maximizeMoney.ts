/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    const target = <string>ns.args[0];
    let maxMoney = ns.getServerMaxMoney(target);

    while (true) {
        // Buy max money increases repeatedly
        while (ns.hacknet.spendHashes('Increase Maximum Money', target, 1)) {
            maxMoney = ns.getServerMaxMoney(target);
        }

        ns.print(ns.formatNumber(maxMoney));
        await ns.sleep(10000);
    }
}