/** @param {NS} ns */
export async function main(ns: NS) {
    const karma = ns.getPlayer().karma;
    const gangRatio = karma / -54000;
    ns.tprint(`${karma} (${ns.formatPercent(gangRatio)} of gang requirements)`);
}