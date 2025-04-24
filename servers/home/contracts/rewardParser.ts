export type RewardSummary = {
    money: number;
    factionRep: { [key: string]: number };
    unprocessedRewards: string[];
};

export function printRewards(ns: NS, rewardsList: string[]) {
    const summary = parseRewards(rewardsList);
    ns.print(rewardSummaryToString(ns, summary));
}

export function parseRewards(rewardsList: string[]): RewardSummary {
    const summary: RewardSummary = {
        money: 0,
        factionRep: {},
        unprocessedRewards: [],
    };

    const moneyRegex = /\$([\d.]+)([kmb])/i;
    const singleFactionRegex = /Gained (\d+) (?:faction )?reputation for ([\w\s-]+)/;
    const multiFactionRegex = /Gained (\d+) reputation for each of the following factions: ([\w\s,-]+)/;

    const multiplierMap: Record<string, number> = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
    };

    for (const reward of rewardsList) {
        if (moneyRegex.test(reward)) {
            const match = reward.match(moneyRegex);
            if (match) {
                const [, amountStr, unit] = match;
                const amount = parseFloat(amountStr);
                const multiplier = multiplierMap[unit.toLowerCase()] || 1;
                summary.money += amount * multiplier;
            }
        } else if (multiFactionRegex.test(reward)) {
            const match = reward.match(multiFactionRegex);
            if (match) {
                const rep = parseInt(match[1]);
                const factions = match[2].split(",").map(f => f.trim());
                for (const faction of factions) {
                    summary.factionRep[faction] = (summary.factionRep[faction] || 0) + rep;
                }
            }
        } else if (singleFactionRegex.test(reward)) {
            const match = reward.match(singleFactionRegex);
            if (match) {
                const rep = parseInt(match[1]);
                const faction = match[2].trim();
                summary.factionRep[faction] = (summary.factionRep[faction] || 0) + rep;
            }
        } else {
            summary.unprocessedRewards.push(reward);
        }
    }

    return summary;
}

export function rewardSummaryToString(ns: NS, summary: RewardSummary) {
    const moneyStr = `Gained ${ns.formatNumber(summary.money)}`;
    const repLines = Object.entries(summary.factionRep)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([faction, rep]) => `- ${faction}: ${ns.formatNumber(rep)} reputation`);
    return [moneyStr, "Faction reputation gained:", ...repLines, ...summary.unprocessedRewards].join("\n");
}
