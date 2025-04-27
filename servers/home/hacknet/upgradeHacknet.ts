import { HacknetMultipliers, NodeStats } from "@/NetscriptDefinitions";

type HacknetServer = {
    level: number,
    maxRam: number,
    cores: number,
}
type Hours = number;
type HashesPerDollarSecond = number;


const SLEEP_TIMER = 10000;

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog('ALL');

    let idealServer = { level: 1, maxRam: 1, cores: 1 };
    let idealServerAmount = ns.hacknet.numNodes();

    // TODO: Min ROI calculation
    let minRoi = 0;

    while (true) {
        let attemptedPurchases = 0;
        let actualPurchases = 0;

        if (ns.hacknet.numNodes() < idealServerAmount) {
            // New server case
            actualPurchases += (ns.hacknet.purchaseNode() > -1) ? 1 : 0;
            attemptedPurchases++;
        } else {
            // Upgrading servers case
            for (let i = 0; i < ns.hacknet.numNodes(); i++) {
                const stats: NodeStats = ns.hacknet.getNodeStats(i);

                if (stats.level < idealServer.level) {
                    actualPurchases += ns.hacknet.upgradeLevel(i) ? 1 : 0;
                    attemptedPurchases++;
                } else if (stats.ram < idealServer.maxRam) {
                    actualPurchases += ns.hacknet.upgradeRam(i) ? 1 : 0;
                    attemptedPurchases++;
                } else if (stats.cores < idealServer.cores) {
                    actualPurchases += ns.hacknet.upgradeCore(i) ? 1 : 0;
                    attemptedPurchases++;
                }
            }
        }


        if (actualPurchases == attemptedPurchases) {
            // If all nodes are ideal, find the next upgrade for our ideal node.
            const mults = ns.getHacknetMultipliers();
            const newServer = findNextUpgrade(ns, idealServer, mults, minRoi);
            if (newServer) {
                idealServer = { level: 1, maxRam: 1, cores: 1 };
                idealServerAmount++;
            }

            ns.print(idealServer);
        } else {
            // If we just didn't have the money, sleep.
            await ns.sleep(SLEEP_TIMER);
        }
    }
}

// Finds the most cost-efficient upgrade. Mutates server, returning true if a new server should be bought.
function findNextUpgrade(ns: NS, server: HacknetServer, mults: HacknetMultipliers, minRoi: HashesPerDollarSecond = 0): boolean {
    const rois = [
        { roi: levelUpgradeRoi(ns, server, mults), type: 'level' },
        { roi: ramUpgradeRoi(ns, server, mults), type: 'ram' },
        { roi: coreUpgradeRoi(ns, server, mults), type: 'core' },
        { roi: newServerRoi(ns, server, mults), type: 'new' },
    ]
    const best = rois.reduce((a, b, index, array) => a.roi > b.roi ? a : b);

    // Assert ROI is sufficient
    if (best.roi < minRoi) {
        throw new Error(`No upgrades above ROI ${minRoi}`);
    }

    ns.print(`Next upgrade payback hours: ${roiToPaybackHours(best.roi)}`);

    switch (best.type) {
        case 'level': server.level++; return false;
        case 'ram': server.maxRam *= 2; return false;
        case 'core': server.cores++; return false;
        case 'new': return true;
        default: throw new Error(`Invalid upgrade type ${best.type}`);
    }
}

function levelUpgradeRoi(ns: NS, server: HacknetServer, mults: HacknetMultipliers): HashesPerDollarSecond {
    const cost = ns.formulas.hacknetServers.levelUpgradeCost(server.level, 1, mults.levelCost);
    const initialRate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam, server.cores, mults.production);
    const upgradedRate = ns.formulas.hacknetServers.hashGainRate(server.level + 1, 0, server.maxRam, server.cores, mults.production);
    return (upgradedRate - initialRate) / cost;
}

function ramUpgradeRoi(ns: NS, server: HacknetServer, mults: HacknetMultipliers): HashesPerDollarSecond {
    const cost = ns.formulas.hacknetServers.ramUpgradeCost(server.maxRam, 1, mults.ramCost);
    const initialRate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam, server.cores, mults.production);
    const upgradedRate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam * 2, server.cores, mults.production);
    return (upgradedRate - initialRate) / cost;
}

function coreUpgradeRoi(ns: NS, server: HacknetServer, mults: HacknetMultipliers): HashesPerDollarSecond {
    const cost = ns.formulas.hacknetServers.coreUpgradeCost(server.cores, 1, mults.coreCost);
    const initialRate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam, server.cores, mults.production);
    const upgradedRate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam, server.cores + 1, mults.production);
    return (upgradedRate - initialRate) / cost;
}

function newServerRoi(ns: NS, server: HacknetServer, mults: HacknetMultipliers): HashesPerDollarSecond {
    let cost = ns.hacknet.getPurchaseNodeCost();
    cost += ns.formulas.hacknetServers.levelUpgradeCost(1, server.level - 1, mults.levelCost);
    cost += ns.formulas.hacknetServers.ramUpgradeCost(1, Math.log2(server.maxRam) - 1, mults.ramCost);
    cost += ns.formulas.hacknetServers.coreUpgradeCost(1, server.cores - 1, mults.coreCost);

    const rate = ns.formulas.hacknetServers.hashGainRate(server.level, 0, server.maxRam, server.cores, mults.production);
    return rate / cost;
}

const HASHES_PER_DOLLAR = 4 / 1e6;
const SECONDS_PER_HOUR = 60 * 60;

function paybackHoursToRoi(paybackHours: Hours): HashesPerDollarSecond {
    const seconds = paybackHours * SECONDS_PER_HOUR;
    const perSecond = 1 / seconds;
    return perSecond * HASHES_PER_DOLLAR;
}

function roiToPaybackHours(roi: HashesPerDollarSecond): Hours {
    const perSecond = roi / HASHES_PER_DOLLAR;
    const perHour = perSecond * SECONDS_PER_HOUR;
    return 1 / perHour;
}