import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    let karma = ns.getPlayer().karma;
    const gangRatio = karma / -54000;
    ns.tprint(`${karma} (${ns.formatPercent(gangRatio)} of gang requirements)`);

    if (ns.args[0] == 'persist') {
        ns.ui.openTail();
        while (true) {
            karma = ns.getPlayer().karma;
            ns.print(`${karma} (${ns.formatPercent(gangRatio)} of gang requirements)`);
            await ns.sleep(10000);
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return ['persist', '--tail'];
}