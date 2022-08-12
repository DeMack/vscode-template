import { NS, Server } from '@ns'

export async function main(ns: NS): Promise<void> {
    const hackScript = "/startup/hack-template.js";
    const noodles = "n00dles";
    const joesguns = "joesguns";

    if (!ns.args || ns.args.length < 1 || typeof ns.args[0] !== "string") throw "Could not start ftp hacks";

    const servers = new Map<string, Server>(
        (ns.args[0]).split("||")
            .map((rawServer) => JSON.parse(rawServer))
            .map((server) => [server.hostname, server])
    );

    for (const [hostname,] of servers) {
        await ns.scp(hackScript, hostname);
    }

    servers.forEach((server => {
        ns.nuke(server.hostname);
    }));

    startHack(servers.get(noodles)!, 1, servers.get(noodles)!);

    servers.forEach((server => {
        if (server.hostname !== noodles)
            startHack(server, Math.floor(server.maxRam / ns.getScriptRam(hackScript)), servers.get(joesguns)!);
    }));

    function startHack(server: Server, threads: number, target: Server) {
        ns.exec(hackScript, server.hostname, threads, target.hostname, target.moneyMax * 0.75, target.minDifficulty + 5);
    }
}