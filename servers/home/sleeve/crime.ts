import { AutocompleteData } from "@/NetscriptDefinitions";

const CrimeType = {
    shoplift: "Shoplift",
    robStore: "Rob Store",
    mug: "Mug",
    larceny: "Larceny",
    dealDrugs: "Deal Drugs",
    bondForgery: "Bond Forgery",
    traffickArms: "Traffick Arms",
    homicide: "Homicide",
    grandTheftAuto: "Grand Theft Auto",
    kidnap: "Kidnap",
    assassination: "Assassination",
    heist: "Heist",
}

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    let crime = CrimeType[<string>ns.args[0]];

    for (let i = 0; i < 6; i++) { // TODO: Dynamically read sleeve amount.
        ns.sleeve.setToCommitCrime(i, crime);
    }
}

export function autocomplete(data: AutocompleteData) {
    const crimeValues: string[] = Object.keys(CrimeType);
    return [...crimeValues, '--tail'];
}