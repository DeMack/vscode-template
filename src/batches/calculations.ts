import { HackingFormulas, Player, Server } from '@ns'
// import ActionStats from '/batches/actions-stats';
import ActionStats from './actions-stats';

const weakenRam = 1.75;
const growRam = 1.75;
const hackRam = 1.75;

const weakenEffect = 0.05;
const growthSecurityEffect = 0.004;
const hackSecurityEffect = 0.002;

export function calcWeaken(hackingFormulas: HackingFormulas, target: Server, player: Player, weakenFactor = target.hackDifficulty - target.minDifficulty): ActionStats {
    const threadsRequired = Math.ceil(weakenFactor / weakenEffect);
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

    const ramRequired = Math.ceil(threadsRequired * weakenRam);
    const timeForWeaken = Math.ceil(hackingFormulas.weakenTime(target, player));
    return new ActionStats(threadsRequired, ramRequired, timeForWeaken);
}

export function calcGrow(hackingFormulas: HackingFormulas, target: Server, player: Player, growthFactor = target.moneyAvailable > 0 ? target.moneyMax / target.moneyAvailable : 100): ActionStats {
    const threadsRequired = Math.ceil(growthFactor / hackingFormulas.growPercent(target, 1, player, 1));
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

    const ramRequired = Math.ceil(threadsRequired * growRam);
    const growthTime = Math.ceil(hackingFormulas.growTime(target, player));
    const securityIncrease = growthSecurityEffect * threadsRequired;
    return new ActionStats(threadsRequired, ramRequired, growthTime, securityIncrease);
}

export function calcHack(hackingFormulas: HackingFormulas, target: Server, player: Player, hackFactor = 0.5): ActionStats {
    const singleThreadPercent = hackingFormulas.hackPercent(target, player);
    const threadsRequired = Math.ceil((1 / singleThreadPercent) * hackFactor); // Only hacking for 50% should allow tighter cycles
    if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

    const ramRequired = Math.ceil(threadsRequired * hackRam);
    const hackingTime = hackingFormulas.hackTime(target, player);
    const securityIncrease = hackSecurityEffect * threadsRequired;
    return new ActionStats(threadsRequired, ramRequired, hackingTime, securityIncrease);
}