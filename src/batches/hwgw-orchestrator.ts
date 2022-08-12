import { NS, Player, Server } from '@ns'
import { calcWeaken, calcGrow, calcHack } from '/batches/calculations';

export async function main(ns: NS): Promise<void> {
    if (!ns.args
        || ns.args.length < 1
        || typeof ns.args[1] !== "string"
        || typeof ns.args[2] !== "string"
        || typeof ns.args[3] !== "string"
    ) throw `Invalid json passed to script: ${ns.args[0]}`;

    const server: Server = JSON.parse(ns.args[1]);
    const homeServer: Server = JSON.parse(ns.args[2]);
    const player: Player = JSON.parse(ns.args[3]);

    const weakenScript = "/batches/weaken.js";
    const growScript = "/batches/grow.js";
    const hackScript = "/batches/hack.js";

    while (true) {
        ns.print(`Calculating batch for ${server.hostname}`);

        const hackStats = calcHack(ns, server, player);
        const hackWeakenStats = calcWeaken(ns, server, homeServer, player, hackStats.securityIncrease);
        const growStats = calcGrow(ns, server, homeServer, player, 2);
        const growWeakenStats = calcWeaken(ns, server, homeServer, player, growStats.securityIncrease);

        // ns.print(`hack: ${JSON.stringify(hackStats)}`);
        // ns.print(`hackWeaken: ${JSON.stringify(hackWeakenStats)}`);
        // ns.print(`grow: ${JSON.stringify(growStats)}`);
        // ns.print(`growWeaken: ${JSON.stringify(growWeakenStats)}`);

        const availableRam = homeServer.maxRam - ns.getServerUsedRam(homeServer.hostname);
        const requiredRam = hackStats.ramRequired
            + hackWeakenStats.ramRequired
            + growStats.ramRequired
            + growWeakenStats.ramRequired;

        if (requiredRam > availableRam) {
            ns.print(`${server.hostname} ram required: ${requiredRam} is more than ${availableRam} available. Skipping for now`);
            await ns.sleep(1000);
            continue;
        }

        const hackWeakenSleepTime = hackStats.timeForAction >= hackWeakenStats.timeForAction
            ? hackStats.timeForAction - hackWeakenStats.timeForAction + 20
            : 0;
        const totalHackWeakenTime = hackWeakenSleepTime + hackWeakenStats.timeForAction;
        // ns.print(`hackWeakenSleepTime: ${hackWeakenSleepTime}`);

        const growSleepTime = totalHackWeakenTime >= growStats.timeForAction
            ? totalHackWeakenTime - growStats.timeForAction + 20
            : 0;
        const totalGrowTime = growSleepTime + growStats.timeForAction;
        // ns.print(`growSleepTime: ${growSleepTime}`);

        const growWeakenSleepTime = totalGrowTime >= growWeakenStats.timeForAction
            ? totalGrowTime - growWeakenStats.timeForAction + 20
            : 0;
        const totalGrowWeakenTime = growWeakenSleepTime + growWeakenStats.timeForAction;
        // ns.print(`growWeakenSleepTime: ${growWeakenSleepTime}`);

        ns.print(`Triggering batch on ${server.hostname}`);
        if (hackStats.threadsRequired > 0) ns.run(hackScript, hackStats.threadsRequired, 0, server.hostname);
        if (hackWeakenStats.threadsRequired > 0) ns.run(weakenScript, hackWeakenStats.threadsRequired, hackWeakenSleepTime, server.hostname, 1);
        if (growStats.threadsRequired > 0) ns.run(growScript, growStats.threadsRequired, growSleepTime, server.hostname);
        if (growWeakenStats.threadsRequired > 0) ns.run(weakenScript, growWeakenStats.threadsRequired, growWeakenSleepTime, server.hostname, 2);

        await ns.sleep(totalGrowWeakenTime + 100);
    }
}