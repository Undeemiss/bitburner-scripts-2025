import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const size = <number> eval(<string> ns.args[1])
    ns.tprint(ns.purchaseServer(<string>ns.args[0], size));
}