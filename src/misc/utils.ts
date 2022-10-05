import { NS, Server } from '@ns'

export function scanAllTheThings(
    ns: NS,
    host: string,
    currentMap: Map<string, string[]> = new Map()
): Map<string, string[]> {
    if (currentMap.has(host)) return currentMap;

    const connections = ns.scan(host);
    currentMap.set(host, connections);
    return connections.reduce((prev, cur) => scanAllTheThings(ns, cur, prev), currentMap);
}

export function buildServerMap(
    ns: NS,
    hostname: string,
    filter: (hostname: string) => boolean = () => true,
    currentMap = new Map<string, Server>(),
    ignored: string[] = []
): Map<string, Server> {
    if (currentMap.has(hostname) || ignored.includes(hostname)) return currentMap;

    if (filter(hostname)) currentMap.set(hostname, ns.getServer(hostname));
    else ignored.push(hostname);

    return ns.scan(hostname).reduce((prev, cur) => buildServerMap(ns, cur, filter, prev, ignored), currentMap);
}

export function validateArgs(
    args: (string | number | boolean)[],
    expectedLength: number,
    expectedTypes: string[],
    customValidator?: ((args: (string | number | boolean)[]) => [boolean, string])
): [boolean, string] {
    if (args.length !== expectedLength) return [false, `Invalid args provided. Expected ${expectedLength}, but ${args.length} provided.`];

    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] !== expectedTypes[i])
            return [false, `Invalid args[${i}]:${args[i]} provided. Expected ${expectedTypes[i]} but ${typeof args[i]} was provided`];
    }

    if (customValidator) return customValidator(args);

    return [true, ""];
}
