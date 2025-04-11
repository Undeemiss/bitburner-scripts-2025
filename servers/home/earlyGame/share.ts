/** @param {NS} ns */
export async function main(ns: NS) {
    const loop = <Boolean>ns.args[0];
    do {
        await ns.share();
    } while (loop)
}