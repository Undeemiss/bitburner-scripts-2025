import { AutocompleteData, CrimeType } from "@/NetscriptDefinitions";
type CrimeString = `${CrimeType}`;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    let crime = <CrimeString>ns.args[0];

    for (let i = 0; i < 6; i++) { // TODO: Dynamically read sleeve amount.
        ns.sleeve.setToCommitCrime(i, crime);
    }
}

export function autocomplete(data: AutocompleteData) {
    let crimeValues: string[] = Object.values(data.enums.CrimeType);
    crimeValues = crimeValues.map((value, index, array) => `\"${value}\"`);
    return [...crimeValues, '--tail'];
}