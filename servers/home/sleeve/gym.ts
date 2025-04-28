import { AutocompleteData } from "@/NetscriptDefinitions";

const GymType = {
    strength: "str",
    defense: "def",
    dexterity: "dex",
    agility: "agi",
}

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    let gymType = GymType[<string>ns.args[0]];

    for (let i = 0; i < 6; i++) { // TODO: Dynamically read sleeve amount.
        ns.sleeve.travel(i, 'Sector-12');
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', gymType);
    }
}

export function autocomplete(data: AutocompleteData) {
    const gymTypes: string[] = Object.keys(GymType);
    return [...gymTypes, '--tail'];
}