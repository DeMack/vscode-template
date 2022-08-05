import { NS, Server } from '@ns'

const home = "home"

export async function main(ns: NS): Promise<void> {
    const [portThreshold, reset] = checkArgs(ns.args);

    const scannedHosts: string[] = [];

    let connections = new Map<string, Server>();

    (function initConnections() {
        ns.tprint("Finding connections...");
        scanForConnections(home);
        filterUnnecessaryConnections();
        ns.tprint(`Total connections found: ${connections.size}`);
    })();

    if (reset) {
        ns.tprint("Resetting all scripts");
        connections.forEach((_, host) => ns.killall(host));
    }

    switch (portThreshold) {
        /* eslint-disable no-fallthrough */
        case 5:
            setupHacks(5, "/startup/start-sql-hacks.js"); // 806
        case 4:
            setupHacks(4, "/startup/start-http-hacks.js"); // 418
        case 3:
            setupHacks(3, "/startup/start-smtp-hacks.js"); // 411
        case 2:
            setupHacks(2, "/startup/start-ftp-hacks.js"); // 150
        case 1:
            setupHacks(1, "/startup/start-ssh-hacks.js"); // 80
        default:
            setupHacks(0, "/startup/start-nuke-hacks.js"); // 10
            break;
        /* eslint-enable no-fallthrough */
    }

    function scanForConnections(host: string) {
        if (!scannedHosts.includes(host)) {
            scannedHosts.push(host);

            for (const conn of ns.scan(host)) {
                if (!connections.has(conn)) connections.set(conn, ns.getServer(conn));
                scanForConnections(conn);
            }
        }
    }

    function filterUnnecessaryConnections() {
        const validConnections = new Map<string, Server>();

        connections.forEach((server) => {
            if (isValidHost(server.hostname) && hasEnoughRam(server)) {
                validConnections.set(server.hostname, server);
            }
        });

        connections = new Map(validConnections);
    }

    function isValidHost(hostname: string) {
        return !(hostname === home || hostname.startsWith("pserv"));
    }

    function hasEnoughRam(server: Server) {
        return (server.maxRam - server.ramUsed) > 1.6;
    }

    function setupHacks(numOfPorts: number, hackStartScript: string) {
        const hackHosts = [...connections.values()]
            .filter((server) => server.numOpenPortsRequired === numOfPorts)
            .map((server) => JSON.stringify(server))
            .join("||");

        ns.run(hackStartScript, 1, hackHosts);
    }
}

function checkArgs(args: (string | number | boolean)[]) {
    return [
        (typeof args[0] === "number") ? args[0] : 5,
        (args.includes("reset"))
    ];
}
