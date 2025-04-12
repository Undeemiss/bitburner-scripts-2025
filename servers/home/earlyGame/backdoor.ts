import { getHosts, farConnect } from "../utils/getHosts";

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');
    ns.enableLog('singularity.installBackdoor');
    ns.ui.openTail();

    const priorityHosts = new Set<string>(['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']);
    for (const hostname of priorityHosts) {
        await backdoor(ns, hostname);
    }

    ns.tprint('Priority Hosts Done');
    ns.print('Priority Hosts Done');

    const hosts = getHosts(ns);
    for (const hostname of hosts) {
        await backdoor(ns, hostname);
    }

    ns.singularity.connect('home');

    ns.tprint('Done');
    ns.print('Done');
}

async function backdoor(ns: NS, hostname: string) {
    farConnect(ns, hostname);
    if (!ns.getServer(hostname).backdoorInstalled) {
        try {
            await ns.singularity.installBackdoor();
            ns.tprint(`Backdoored '${hostname}'`);
            ns.print(`Backdoored '${hostname}'`);
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