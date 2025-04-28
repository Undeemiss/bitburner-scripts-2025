import { AutocompleteData } from "@/NetscriptDefinitions";

const GANG_REQUIRED_KARMA = -54000;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    let karma = ns.getPlayer().karma;
    ns.tprint(`${karma} (${ns.formatPercent(karma / GANG_REQUIRED_KARMA)} of gang requirements)`);

    if (ns.args[0] == 'persist') {
        ns.ui.openTail();
        while (true) {
            ns.clearLog();
            karma = ns.getPlayer().karma;
            ns.print(`${karma} (${ns.formatPercent(karma / GANG_REQUIRED_KARMA)} of gang requirements)`);
            await ns.sleep(10000);
        }
    }
}

export function autocomplete(data: AutocompleteData) {
    return ['persist', '--tail'];
}