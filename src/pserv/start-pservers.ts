import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const scriptSize = 1.75;

    const scripts = [
        "/home/home-grow-template.js",
        "/home/home-weaken-template.js"
    ]

    const targets = [
        // "joesguns",
        "max-hardware",
        "silver-helix",
        "rothman-uni"
    ]

    const servers = ns.scan("home")
        .filter((server) => server.startsWith("pserv"));

    if (ns.args) {
        const reset = ns.args.includes("reset");
        ns.tprint("Resetting all private servers...");
        if (reset) servers.forEach((server) => ns.killall(server));
    }

    for (const server of servers) {
        for (const script of scripts) {
            await ns.scp(script, server);
        }
    }

    let targetsValues = targets.values();
    let curTarget = targetsValues.next();
    let isGrow = true;

    servers.forEach((server) => {
        if (curTarget.done) {
            targetsValues = targets.values();
            curTarget = targetsValues.next();
        }
        const curScript = scripts[isGrow ? 0 : 1];

        const serverRam = ns.getServerMaxRam(server);
        const numOfThreads = Math.floor(serverRam / scriptSize);

        ns.exec(curScript, server, numOfThreads, curTarget.value);

        isGrow = !isGrow;
        if (isGrow) curTarget = targetsValues.next();
    });
}