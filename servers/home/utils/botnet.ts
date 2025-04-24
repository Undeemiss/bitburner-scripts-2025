import { ScriptArg, Server } from "@/NetscriptDefinitions";
const weakenScriptFilepath = 'batching/weaken.js';

// Calculate how many threads of a given ram cost can be run on a botnet with available RAM
export function getMaxThreads(ns: NS, botnet: Set<string>, ramCost: number) {
    let maxThreads = 0;
    for (const hostname of botnet) {
        const server = ns.getServer(hostname);
        if (server.hasAdminRights) {
            maxThreads += Math.floor((server.maxRam - server.ramUsed) / ramCost);
        }
    }
    return maxThreads;
}

// Returns a list of server hostnames with at least minRam available, smallest first.
export function getSortedServers(ns: NS, botnet: Set<string>, minRam: number) {
    type FreeRamServer = Server & { freeRam?: number };
    const serverList: FreeRamServer[] = [];

    // Check each server in the botnet
    for (const hostname of botnet) {
        // If the server has sufficient RAM, add it to our list.
        const server: FreeRamServer = ns.getServer(hostname);
        server.freeRam = getFreeRam(ns, server);
        if (server.freeRam >= minRam) {
            serverList.push(server);
        }
    }

    // Sort the server list
    serverList.sort((a, b) => a.freeRam - b.freeRam);
    return serverList.map(x => x.hostname);
}

// Distribute a large number of threads across a botnet. Returns the number of threads that could not be filled.
export function execOnBotnet(ns: NS, botnet: Set<string>, filepath: string, threads: number, args: ScriptArg[], splittable: boolean = true, temporary: boolean = true) {
    // Short-circuit and/or error on nonsense operations
    if (threads == 0) {
        return 0;
    } else if (threads < 0) {
        throw RangeError(`execOnBotnet cannot fulfill ${threads} threads.`);
    }

    // Initialize ram-cost related values
    const ramCost = ns.getScriptRam(filepath, 'home');
    let remainingThreads = threads;
    const neededRam = splittable ? ramCost : ramCost * threads;

    // Iterate through the server list, spreading the thread load.
    const sortedBotnet = getSortedServers(ns, botnet, neededRam);
    for (const hostname of sortedBotnet) {
        // Check how many threads the server can run
        const server = ns.getServer(hostname);
        if (!(server.hasAdminRights)) {
            continue;
        }
        const maxThreads = Math.floor((server.maxRam - server.ramUsed) / ramCost);
        const actualThreads = Math.min(maxThreads, remainingThreads);

        // Put as many threads as possible on this machine
        if (actualThreads > 0) {
            ns.scp(filepath, hostname, 'home');
            const returnValue = ns.exec(filepath, hostname, { threads: actualThreads, temporary: temporary }, ...args);
            if (returnValue == 0) {
                throw new Error(`failed ns.exec(${filepath}, ${hostname}, { threads: ${actualThreads}, temporary: ${temporary}}, ...args); with args=${args}`);
            }

            // Keep track of how many threads are left, and short-circuit as applicable.
            remainingThreads -= actualThreads;
            if (remainingThreads <= 0) {
                break;
            } else if (!splittable) {
                throw new Error('A non-splitting execOnBotnet call was split. This is a bug in execOnBotnet.');
            }
        }
    }
    return remainingThreads;
}


// Execute a mass weaken() command.
export function weakenOnBotnet(ns: NS, botnet: Set<string>, difficultyOffset: number, targetHostname: string) {
    // export function execOnBotnet(ns: NS, botnet: Set<string>, weakenScriptFilepath: string, threads: number, args: ScriptArg[], temporary: boolean = true) {
    // Short-circuit and/or error on nonsense operations
    if (difficultyOffset == 0) {
        return;
    } else if (difficultyOffset < 0) {
        throw RangeError(`weakenOnBotnet cannot fulfill a negative difficultyOffset (${difficultyOffset}).`);
    }

    // Iterate through the server list, spreading the thread load. Prioritizes filling out low-RAM servers.
    const sortedBotnet = getSortedServers(ns, botnet, 1.75);
    for (const hostname of sortedBotnet) {
        const server = ns.getServer(hostname);
        const availableThreads = getFreeRam(ns, server, 1.75);
        if (availableThreads > 0) {
            // Check how many threads we actually want, accounting for CPU cores
            const weakenEffect = ns.weakenAnalyze(1, ns.getServer(hostname).cpuCores);
            const requestedThreads = Math.ceil(difficultyOffset / weakenEffect)
            const actualThreads = Math.min(availableThreads, requestedThreads);

            // Run the weaken script
            ns.scp(weakenScriptFilepath, hostname, 'home');
            const returnValue = ns.exec(weakenScriptFilepath, hostname, { threads: actualThreads, temporary: true }, targetHostname);
            if (returnValue == 0) {
                throw new Error(`Failed to execute weaken on ${targetHostname} from ${hostname}.`);
            }

            // Return if the difficulty has been fully offset
            difficultyOffset -= weakenEffect * actualThreads;
            if (difficultyOffset <= 0) {
                return;
            }
        }
    }

    // If we get here, all servers have failed. Throw an error.
    const err: any = new Error('Insufficient RAM on botnet.');
    err.difficultyOffset = difficultyOffset;
    throw err;
}

// Helper function for transitioning systems expecting to provide a number of threads. May overshoot slightly.
export function weakenOnBotnetByThreads(ns: NS, botnet: Set<string>, weakenThreads: number, targetHostname: string) {
    const difficultyOffset = weakenThreads * ns.weakenAnalyze(1);
    return weakenOnBotnet(ns, botnet, difficultyOffset, targetHostname);
}

function getFreeRam(ns: NS, server: Server, threadCost?: number) {
    if (!server.hasAdminRights) {
        return 0;
    }
    const freeRam = server.maxRam - server.ramUsed;
    if (threadCost === undefined) {
        return freeRam;
    } else {
        return Math.floor(freeRam / threadCost);
    }
}