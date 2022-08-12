import { NS, Player, Server } from '@ns'
import { calcWeaken, calcGrow } from '/batches/calculations';

export async function main(ns: NS): Promise<void> {
    ns.clearLog();
    ns.disableLog("scan");
    // ns.disableLog("run");
    ns.tail();

    const gb = 1_000_000_000;
    const home = "home";
    const weakenScript = "/batches/weaken.js";
    const growScript = "/batches/grow.js";

    const portThreshold = 1;

    const scannedHosts: string[] = [];
    const servers = new Map<string, Server>();

    let homeServer: Server;
    let player: Player;

    refreshTargetData();

    // Nuke all targets, just to make sure
    servers.forEach((server, hostname) => {
        if (!server.hasAdminRights) {
            ns.sqlinject(hostname);
            ns.httpworm(hostname);
            ns.relaysmtp(hostname);
            ns.ftpcrack(hostname);
            ns.brutessh(hostname);
            ns.nuke(hostname);
        }
    });

    await intializeNodesForBatch()
        .then(executeBatch);

    function refreshTargetData() {
        player = ns.getPlayer();
        homeServer = ns.getServer(home);

        scannedHosts.length = 0;
        servers.clear();
        refreshServerData(home);
        const tempMap = new Map(Array.from(servers.entries()).sort((a, b) => b[1].moneyMax - a[1].moneyMax));
        servers.clear();
        tempMap.forEach((server, hostname) => servers.set(hostname, server));
    }

    function refreshServerData(host: string) {
        if (!scannedHosts.includes(host)) {
            scannedHosts.push(host);

            for (const conn of ns.scan(host)) {
                if (conn !== home
                    && conn !== "joesguns"
                    && conn !== "max-hardware"
                    && conn !== "silver-helix"
                    && conn !== "rothman-uni"
                    && conn !== "aevum-police"
                    && conn !== "solaris"
                    && !conn.startsWith("pserv")
                    && !servers.has(conn)
                ) {
                    const server = ns.getServer(conn);
                    if (server.moneyMax > 1 && server.numOpenPortsRequired <= portThreshold) servers.set(conn, server);
                }

                refreshServerData(conn);
            }
        }
    }

    async function intializeNodesForBatch() {
        let longestBatchTime = 0;
        let availableRam = homeServer.maxRam - homeServer.ramUsed;

        const excludedNodes: string[] = [];

        for (const [hostname, server] of servers) {
            ns.print(`Calculating initial prep for ${hostname}`);

            const weakenStats = calcWeaken(ns, server, homeServer, player);
            const growStats = calcGrow(ns, server, homeServer, player);
            const reweakenStats = calcWeaken(ns, server, homeServer, player, growStats.securityIncrease);

            const requiredRam = weakenStats.ramRequired + growStats.ramRequired + reweakenStats.ramRequired;
            if (requiredRam > availableRam) {
                ns.print(`${hostname} ram required: ${ns.nFormat(requiredRam * gb, "0.000b")} is more than ${ns.nFormat(availableRam * gb, "0.000b")} available`);
                excludedNodes.push(hostname);
                continue;
            } else availableRam -= requiredRam;

            const growSleepTime = weakenStats.timeForAction > growStats.timeForAction
                ? weakenStats.timeForAction - growStats.timeForAction + 20
                : 0;
            const totalGrowTime = growSleepTime + growStats.timeForAction;

            const reweakenSleepTime = totalGrowTime > reweakenStats.timeForAction
                ? totalGrowTime - reweakenStats.timeForAction + 20
                : 0;
            const totalReweakenTime = reweakenSleepTime + reweakenStats.timeForAction;

            if (weakenStats.threadsRequired >= 1) ns.run(weakenScript, weakenStats.threadsRequired, 0, hostname, 1);
            if (growStats.threadsRequired >= 1) ns.run(growScript, growStats.threadsRequired, growSleepTime, hostname);
            if (reweakenStats.threadsRequired >= 1) ns.run(weakenScript, reweakenStats.threadsRequired, reweakenSleepTime, hostname, 2);

            if (totalReweakenTime > longestBatchTime) longestBatchTime = totalReweakenTime;
        }

        await ns.sleep(longestBatchTime);
        return excludedNodes;
    }

    async function executeBatch(excludedNodes: string[]) {
        ns.print("Begin calculating next batch");

        refreshTargetData();

        servers.forEach((server) => {
            if (!excludedNodes.includes(server.hostname)) {
                ns.run("/batches/hwgw-orchestrator.js", 1, server.hostname, JSON.stringify(server), JSON.stringify(homeServer), JSON.stringify(player));
            }
        });
    }
}