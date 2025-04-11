import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {

    ns.singularity.purchaseTor();
    ns.singularity.purchaseProgram('BruteSSH.exe');
    ns.singularity.purchaseProgram('FTPCrack.exe');
    ns.singularity.purchaseProgram('relaySMTP.exe');
    ns.singularity.purchaseProgram('HTTPWorm.exe');
    ns.singularity.purchaseProgram('SQLInject.exe');

    const knownHosts = getHosts(ns);
    let total = knownHosts.size;
    let root = 0;
    let nuked = 0;

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
            if (ns.hasRootAccess(host)) {
                root++;
                // ns.tprint(`.$ ${host}`)
            } else {
                ns.nuke(host);
                root++;
                nuked++;
                // ns.tprint(`!$ ${host}`);
            }
        } catch (e) {

        }
    }

    ns.tprint(`\n Nuked ${nuked} new servers. ${root}/${total} controlled.`);
}