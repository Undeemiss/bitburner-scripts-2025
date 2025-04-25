import { AutocompleteData, UniversityClassType } from "@/NetscriptDefinitions";
type ClassString = `${UniversityClassType}`;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    let course: ClassString;
    switch (ns.args[0]) {
        case undefined: course = 'Algorithms'; break;
        case 'hacking': course = 'Algorithms'; break;
        case 'charisma': course = 'Leadership'; break;
        default: course = <ClassString>ns.args[0];
    }

    for (let i = 0; i < 6; i++) { // TODO: Dynamically read sleeve amount.
        ns.sleeve.travel(i, 'Volhaven');
        ns.sleeve.setToUniversityCourse(i, 'ZB Institute of Technology', course);
    }
}

export function autocomplete(data: AutocompleteData) {
    let classValues: string[] = Object.values(data.enums.UniversityClassType);
    classValues = classValues.map((value, index, array) => `\"${value}\"`);
    return ['hacking', 'charisma', ...classValues, '--tail'];
}