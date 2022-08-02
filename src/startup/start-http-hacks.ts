import { NS, Server } from '@ns'

export async function main(ns: NS): Promise<void> {
    const hackScript = "/templates/http-hack-template.js";
    const target = "aevum-police";

    if (!ns.args || ns.args.length < 1 || typeof ns.args[0] !== "string") throw "Could not start ftp hacks";

    const servers = new Map<string, Server>(
        (ns.args[0]).split("||")
            .map((rawServer) => JSON.parse(rawServer))
            .map((server) => [server.hostname, server])
    );

    for (const [hostname] of servers) {
        await ns.scp(hackScript, hostname);
        ns.brutessh(hostname);
        ns.ftpcrack(hostname);
        ns.relaysmtp(hostname);
        ns.httpworm(hostname);
        ns.nuke(hostname);
    }

    servers.forEach((server) => startHack(server, Math.floor(server.maxRam / ns.getScriptRam(hackScript)), servers.get(target)!));

    function startHack(server: Server, threads: number, target: Server) {
        ns.exec(hackScript, server.hostname, threads, target.hostname, target.moneyMax * 0.75, target.minDifficulty + 5);
    }
}