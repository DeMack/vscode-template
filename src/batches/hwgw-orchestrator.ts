import { NS, Player, Server } from '@ns'

class ActionStats {
    threadsRequired: number;
    ramRequired: number;
    timeForAction: number;
    securityIncrease: number;

    constructor(threadsRequired: number, ramRequired: number, timeForAction: number, securityIncrease = 0) {
        this.threadsRequired = threadsRequired;
        this.ramRequired = ramRequired;
        this.timeForAction = timeForAction > 20 ? timeForAction : 20;
        this.securityIncrease = securityIncrease;
    }
}

export async function main(ns: NS): Promise<void> {
    ns.clearLog();
    ns.disableLog("scan");
    ns.disableLog("run");
    ns.tail();

    const home = "home";
    const weakenScript = "/batches/weaken.js"
    const growScript = "/batches/grow.js"
    const hackScript = "/batches/hack.js"
    const weakenRam = ns.getScriptRam(weakenScript);
    const growRam = ns.getScriptRam(growScript);
    const hackRam = ns.getScriptRam(hackScript);

    const portThreshold = 3;

    const scannedHosts: string[] = [];
    const servers = new Map<string, Server>();

    let homeServer: Server;
    let player: Player;

    refreshTargetData();

    // Nuke all targets, just to make sure
    servers.forEach((server, hostname) => {
        if (!server.hasAdminRights) {
            ns.ftpcrack(hostname);
            ns.brutessh(hostname);
            ns.nuke(hostname);
        }
    });

    await initializeSingleNode();
    await executeSingleBatch();

    // await intializeNodesForBatch();
    // await executeBatch();

    function refreshTargetData() {
        player = ns.getPlayer();
        homeServer = ns.getServer(home);

        scannedHosts.length = 0;
        servers.clear();
        refreshServerData(home);
    }

    function refreshServerData(host: string) {
        if (!scannedHosts.includes(host)) {
            scannedHosts.push(host);

            for (const conn of ns.scan(host)) {
                if (conn !== home
                    && conn !== "joesguns"
                    && conn !== "max-hardware"
                    && conn !== "silver-helix"
                    && !conn.startsWith("pserv")
                    && !servers.has(conn)
                ) {
                    const server = ns.getServer(conn);
                    if (server.moneyMax > 1 && server.numOpenPortsRequired < portThreshold) servers.set(conn, server);
                }

                refreshServerData(conn);
            }
        }
    }

    async function initializeSingleNode() {
        const hostname = "johnson-ortho";
        const server = servers.get(hostname)!;

        ns.print(`Calculating initial prep for ${hostname}`);

        const weakenStats = calcWeaken(server);
        const growStats = calcGrow(server);
        const reweakenStats = calcWeaken(server, growStats.securityIncrease);

        const availableRam = homeServer.maxRam - homeServer.ramUsed;
        const requiredRam = weakenStats.ramRequired + growStats.ramRequired + reweakenStats.ramRequired;
        if (requiredRam > availableRam) {
            ns.print(`${hostname} ram required: ${requiredRam} is more than ${availableRam} available`);
            throw "....Seriously????";
        }

        const growSleepTime = weakenStats.timeForAction > growStats.timeForAction
            ? weakenStats.timeForAction - growStats.timeForAction + 20
            : 0;

        const reweakenSleepTime = growSleepTime > reweakenStats.timeForAction
            ? growSleepTime - reweakenStats.timeForAction + 20
            : 0;

        if (weakenStats.threadsRequired >= 1) {
            ns.print(`running weaken on ${hostname}`);
            ns.run(weakenScript, weakenStats.threadsRequired, 0, hostname, 1);
        }

        if (growStats.threadsRequired >= 1) {
            ns.print(`running grow on ${hostname}`);
            ns.run(growScript, growStats.threadsRequired, growSleepTime, hostname);
        }

        if (reweakenStats.threadsRequired >= 1) {
            ns.print(`running reweaken on ${hostname}`);
            ns.run(weakenScript, reweakenStats.threadsRequired, reweakenSleepTime, hostname, 2);
        }

        await ns.sleep(reweakenSleepTime + reweakenStats.timeForAction);
    }

    async function intializeNodesForBatch() {
        let longestBatchTime = 0;

        for (const [hostname, server] of servers) {
            ns.print(`Calculating initial prep for ${hostname}`);

            const weakenStats = calcWeaken(server);
            const growStats = calcGrow(server);
            const reweakenStats = calcWeaken(server, growStats.securityIncrease);

            const availableRam = homeServer.maxRam - homeServer.ramUsed;
            const requiredRam = weakenStats.ramRequired + growStats.ramRequired + reweakenStats.ramRequired;
            if (requiredRam > availableRam) {
                ns.print(`${hostname} ram required: ${requiredRam} is more than ${availableRam} available`);
                continue;
            }

            const growSleepTime = weakenStats.timeForAction > growStats.timeForAction
                ? weakenStats.timeForAction - growStats.timeForAction + 20
                : 0;

            const reweakenSleepTime = growSleepTime > reweakenStats.timeForAction
                ? growSleepTime - reweakenStats.timeForAction + 20
                : 0;

            if (weakenStats.threadsRequired >= 1) {
                ns.print(`running weaken on ${hostname}`);
                ns.run(weakenScript, weakenStats.threadsRequired, 0, hostname, 1);
            }

            if (growStats.threadsRequired >= 1) {
                ns.print(`running grow on ${hostname}`);
                ns.run(growScript, growStats.threadsRequired, growSleepTime, hostname);
            }

            if (reweakenStats.threadsRequired >= 1) {
                ns.print(`running reweaken on ${hostname}`);
                ns.run(weakenScript, reweakenStats.threadsRequired, reweakenSleepTime, hostname, 2);
            }

            const totalBatchTime = reweakenStats.timeForAction + reweakenSleepTime;

            if (totalBatchTime > longestBatchTime) longestBatchTime = totalBatchTime;
        }

        await ns.sleep(longestBatchTime);
    }

    async function executeSingleBatch() {
        while (true) {
            const hostname = "johnson-ortho";
            const server = servers.get(hostname)!;

            ns.print(`Calculating batch for ${hostname}`);

            const hackStats = calcHack(server)
            const hackWeakenStats = calcWeaken(server, hackStats.securityIncrease);
            const growStats = calcGrow(server, 2);
            const growWeakenStats = calcWeaken(server, growStats.securityIncrease);

            ns.print(hackStats);
            ns.print(hackWeakenStats);
            ns.print(growStats);
            ns.print(growWeakenStats);

            const availableRam = homeServer.maxRam - homeServer.ramUsed;
            const requiredRam = hackStats.ramRequired
                + hackWeakenStats.ramRequired
                + growStats.ramRequired
                + growWeakenStats.ramRequired;

            if (requiredRam > availableRam) {
                ns.print(`${hostname} ram required: ${requiredRam} is more than ${availableRam} available. Skipping for now`);
                throw "....Seriously????";
            }

            const hackWeakenSleepTime = hackStats.timeForAction > hackWeakenStats.timeForAction
                ? hackStats.timeForAction - hackWeakenStats.timeForAction + 20
                : 0;

            const growSleepTime = hackWeakenSleepTime > growStats.timeForAction
                ? hackWeakenSleepTime - growStats.timeForAction + 20
                : 0;

            const growWeakenSleepTime = growSleepTime > growWeakenStats.timeForAction
                ? growSleepTime - growWeakenStats.timeForAction + 20
                : 0;

            ns.print(`Triggering batch on ${hostname}`);
            if (hackStats.threadsRequired > 0) ns.run(hackScript, hackStats.threadsRequired, 0, hostname);
            if (hackWeakenStats.threadsRequired > 0) ns.run(weakenScript, hackWeakenStats.threadsRequired, hackWeakenSleepTime, hostname, 1);
            if (growStats.threadsRequired > 0) ns.run(growScript, growStats.threadsRequired, growSleepTime, hostname);
            if (growWeakenStats.threadsRequired > 0) ns.run(weakenScript, growWeakenStats.threadsRequired, growWeakenSleepTime, hostname, 2);

            await ns.sleep(growWeakenSleepTime + growWeakenStats.timeForAction);
        }
    }

    async function executeBatch() {
        while (true) {
            ns.print("Begin calculating next batch");

            refreshTargetData();

            let longestBatchTime = 0;

            for (const [hostname, server] of servers) {
                ns.print(`Calculating batch for ${hostname}`);

                const hackStats = calcHack(server)
                const hackWeakenStats = calcWeaken(server, hackStats.securityIncrease);
                const growStats = calcGrow(server, 2);
                const growWeakenStats = calcWeaken(server, growStats.securityIncrease);

                const availableRam = homeServer.maxRam - homeServer.ramUsed;
                const requiredRam = hackStats.ramRequired
                    + hackWeakenStats.ramRequired
                    + growStats.ramRequired
                    + growWeakenStats.ramRequired;

                if (requiredRam > availableRam) {
                    ns.print(`${hostname} ram required: ${requiredRam} is more than ${availableRam} available. Skipping for now`);
                    continue;
                }

                const hackWeakenSleepTime = hackStats.timeForAction > hackWeakenStats.timeForAction
                    ? hackStats.timeForAction - hackWeakenStats.timeForAction + 20
                    : 0;

                const growSleepTime = hackWeakenSleepTime > growStats.timeForAction
                    ? hackWeakenSleepTime - growStats.timeForAction + 20
                    : 0;

                const growWeakenSleepTime = growSleepTime > growWeakenStats.timeForAction
                    ? growSleepTime - growWeakenStats.timeForAction + 20
                    : 0;

                const totalBatchTime = growWeakenStats.timeForAction + growWeakenSleepTime;

                if (totalBatchTime > longestBatchTime) longestBatchTime = totalBatchTime;

                ns.print(`Triggering batch on ${hostname}`);
                if (hackStats.threadsRequired > 0) ns.run(hackScript, hackStats.threadsRequired, 0, hostname);
                if (hackWeakenStats.threadsRequired > 0) ns.run(weakenScript, hackWeakenStats.threadsRequired, hackWeakenSleepTime, hostname);
                if (growStats.threadsRequired > 0) ns.run(growScript, growStats.threadsRequired, growSleepTime, hostname);
                if (growWeakenStats.threadsRequired > 0) ns.run(weakenScript, growWeakenStats.threadsRequired, growWeakenSleepTime, hostname);

                // TODO: Currently this is waiting on all nodes to finish before restarting.
                const sleepTime = longestBatchTime + 1500
                ns.print(`The next batch will begin in ${sleepTime}`)
                await ns.sleep(sleepTime);
            }
        }
    }

    function calcWeaken(target: Server, weakenFactor = target.hackDifficulty - target.minDifficulty) {
        const weakenEffect = ns.weakenAnalyze(1, homeServer.cpuCores);
        const threadsRequired = weakenFactor / weakenEffect;
        if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);
        const roundedThreads = Math.ceil(threadsRequired);

        const ramRequired = Math.ceil(roundedThreads * weakenRam);
        const timeForWeaken = Math.ceil(ns.formulas.hacking.weakenTime(target, player));
        return new ActionStats(roundedThreads, ramRequired, timeForWeaken);
    }

    function calcGrow(target: Server, growthFactor = target.moneyAvailable > 0 ? target.moneyMax / target.moneyAvailable : 100) {
        ns.print(`max: ${target.moneyMax} / available: ${target.moneyAvailable} = ${growthFactor}`);
        const threadsRequired = Math.ceil(ns.growthAnalyze(target.hostname, growthFactor, homeServer.cpuCores));
        if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

        const ramRequired = Math.ceil(threadsRequired * growRam);
        const growthTime = Math.ceil(ns.formulas.hacking.growTime(target, player));
        const securityIncrease = Math.ceil(ns.growthAnalyzeSecurity(threadsRequired, target.hostname, homeServer.cpuCores));
        return new ActionStats(threadsRequired, ramRequired, growthTime, securityIncrease);
    }

    function calcHack(target: Server) {
        const hackPercent = ns.formulas.hacking.hackPercent(target, player);
        const threadsRequired = Math.ceil((1 / hackPercent) * 0.50); // Only hacking for 50% should allow tighter cycles
        if (threadsRequired < 1) return new ActionStats(0, 0, 0, 0);

        const ramRequired = Math.ceil(threadsRequired * hackRam);
        const hackingTime = ns.formulas.hacking.hackTime(target, player);
        const securityIncrease = Math.ceil(ns.hackAnalyzeSecurity(threadsRequired, target.hostname));
        return new ActionStats(threadsRequired, ramRequired, hackingTime, securityIncrease);
    }
}