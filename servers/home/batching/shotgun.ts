import { AutocompleteData } from "@/NetscriptDefinitions";

/** @param {NS} ns */
export async function main(ns: NS) {
    
}

export function autocomplete(data: AutocompleteData) {
    return [...data.servers, '--tail'];
}