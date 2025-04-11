import { ScriptArg } from "@/NetscriptDefinitions";

// Calculate how many threads of a given ram cost can be run on a botnet with available RAM
export function getMaxThreads(ns: NS, botnet: Set<string>, ramCost: number) {
    let maxThreads = 0;
    for (const hostname of botnet) {
        const server = ns.getServer(hostname);
        maxThreads += Math.floor((server.maxRam - server.ramUsed) / ramCost);
    }
    return maxThreads;
}

// Distribute a large number of threads across a botnet. Returns the number of threads that could not be filled.
export function execOnBotnet(ns: NS, botnet: Set<string>, filepath: string, threads: number, args: ScriptArg[], temporary: boolean = true) {
    // Short-circuit and/or error on nonsense operations
    if (threads == 0) {
        return 0;
    } else if (threads < 0) {
        throw RangeError(`execOnBotnet cannot fulfill ${threads} threads.`);
    }

    // Initialize necessary values
    const ramCost = ns.getScriptRam(filepath, 'home');
    let remainingThreads = threads;

    // Iterate through the server list, spreading the thread load.
    for (const hostname of botnet) {
        // Check how many threads the server can run
        const server = ns.getServer(hostname);
        const maxThreads = Math.floor((server.maxRam - server.ramUsed) / ramCost);
        const actualThreads = Math.min(maxThreads, remainingThreads);

        // Put as many threads as possible on this machine
        if (actualThreads > 0) {
            ns.scp(filepath, hostname, 'home');
            ns.exec(filepath, hostname, { threads: threads, temporary: temporary }, ...args);

            // Keep track of how many threads are left, and short-circuit as applicable.
            remainingThreads -= actualThreads;
            if (remainingThreads <= 0) {
                break;
            }
        }
    }
    return remainingThreads;
}