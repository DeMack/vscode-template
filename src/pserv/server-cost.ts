import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    for (let i = 0; i <= 10; i++) {
        const size = 2 ** i;
        const serverCost = ns.getPurchasedServerCost(size);
        printCost(`2^${i}`, size, serverCost);
    }

    const maxSize = ns.getPurchasedServerMaxRam();
    printCost("Max", maxSize, ns.getPurchasedServerCost(maxSize));

    function printCost(pow: string, size: number, cost: number) {
        ns.tprint(`${pow}: size: ${ns.nFormat(size * 1_000_000_000, "0.000b")} -- cost: ${ns.nFormat(cost, "$0,0.000a")}/pserv -- total: ${ns.nFormat(cost * 25, "$0,0.000a")}`);
    }
}