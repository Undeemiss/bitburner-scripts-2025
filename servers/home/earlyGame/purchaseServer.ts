import { getHosts } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.tprint(ns.purchaseServer(<string>ns.args[0], <number>ns.args[1]));
}