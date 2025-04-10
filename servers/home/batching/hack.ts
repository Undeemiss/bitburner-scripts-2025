import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    const opts = {
        additionalMsec: (<number> ns.args[1]) || 0,
        stock: (<boolean> ns.args[2]) || false,
    }
    await ns.hack(<string> ns.args[0], opts)
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}