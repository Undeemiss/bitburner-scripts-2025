/** @param {NS} ns */
export async function main(ns: NS) {
    const hostname: string = <string>(ns.args[0] || ns.getRunningScript().server);
    let weakenAmount: number = 0.05 * ns.getRunningScript().threads;
    weakenAmount = Math.min(weakenAmount, 3);
    const moneyFactor: number = 0.9

    while (true) {
        if (ns.getServerSecurityLevel(hostname) >= ns.getServerMinSecurityLevel(hostname) + weakenAmount) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) <= (ns.getServerMaxMoney(hostname) * moneyFactor)) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}
