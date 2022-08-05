import { NS, Player, Server } from '@ns'
import ActionStats from 'batches/actions-stats';

const weakenRam = 1.75;
const growRam = 1.75;
const hackRam = 1.75;

export function calcWeaken(ns: NS, target: Server, homeServer: Server, player: Player, weakenFactor = target.hackDifficulty - target.minDifficulty): ActionStats {
    const weakenEffect = ns.weakenAnalyze(1, homeServer.cpuCores);
    const threadsRequired = weakenFactor / weakenEffect;
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);
    const roundedThreads = Math.floor(threadsRequired);

    const ramRequired = Math.ceil(roundedThreads * weakenRam);
    const timeForWeaken = Math.ceil(ns.formulas.hacking.weakenTime(target, player));
    return new ActionStats(roundedThreads, ramRequired, timeForWeaken);
}

export function calcGrow(ns: NS, target: Server, homeServer: Server, player: Player, growthFactor = target.moneyAvailable > 0 ? target.moneyMax / target.moneyAvailable : 100): ActionStats {
    const threadsRequired = Math.floor(ns.growthAnalyze(target.hostname, growthFactor, homeServer.cpuCores));
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

    const ramRequired = Math.ceil(threadsRequired * growRam);
    const growthTime = Math.ceil(ns.formulas.hacking.growTime(target, player));
    const securityIncrease = Math.ceil(ns.growthAnalyzeSecurity(threadsRequired, target.hostname, homeServer.cpuCores));
    // ns.print(`Grow security increase: ${ns.nFormat(ns.growthAnalyzeSecurity(threadsRequired, target.hostname, homeServer.cpuCores), "0.000")}`);
    return new ActionStats(threadsRequired, ramRequired, growthTime, securityIncrease);
}

export function calcHack(ns: NS, target: Server, player: Player): ActionStats {
    const hackPercent = ns.formulas.hacking.hackPercent(target, player);
    ns.print(`hackPercent: ${ns.nFormat(hackPercent, "0.000")}`);
    const threadsRequired = Math.floor((1 / hackPercent) * 0.50); // Only hacking for 50% should allow tighter cycles
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

    const ramRequired = Math.ceil(threadsRequired * hackRam);
    const hackingTime = ns.formulas.hacking.hackTime(target, player);
    const securityIncrease = Math.ceil(ns.hackAnalyzeSecurity(threadsRequired, target.hostname));
    // ns.print(`Hack security increase: ${ns.nFormat(ns.hackAnalyzeSecurity(threadsRequired, target.hostname), "0.000")}`);
    return new ActionStats(threadsRequired, ramRequired, hackingTime, securityIncrease);
}