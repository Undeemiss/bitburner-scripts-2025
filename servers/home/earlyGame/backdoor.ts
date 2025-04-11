import { getHosts, farConnect } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    const hosts = getHosts(ns);

    for (const hostname of hosts) {
        farConnect(ns, hostname);
        if (!ns.getServer(hostname).backdoorInstalled) {
            try {
                await ns.singularity.installBackdoor();
                ns.tprint(`Backdoored '${hostname}'`);
            } catch (e) { // Stupid error handling
                try {
                    if (!(e.includes('singularity.installBackdoor: Cannot '))) {
                        throw e;
                    }
                    // ns.tprint(`Skipping '${hostname}'`);
                } catch (_) {
                    throw e;
                }
            }
        }
    }

}