import { NS } from '@ns'
import ServerTree from '/misc/server-tree'

export async function main(ns: NS): Promise<void> {
    await ServerTree.buildTree(ns).traverseAndExecute(
        async (host, ns) => {
            const server = ns!.getServer(host);
            if (server.maxRam <= 1) ns?.tprint(host);
        },
        () => Promise.resolve(),
        true,
        ns
    );

    // ns.scan("home").forEach((server) => {
    //     ns.tprint(`${server} base growth increase = ${ns.growthAnalyzeSecurity(1, server, 1)}`);
    // });

    // ns.tprint(ns.codingcontract.getContractType("contract-934199-Netburners.cct", "sigma-cosmetics"));
    // ns.tprint("------------------------------------------------------------------------------------")
    // ns.tprint("------------------------------------------------------------------------------------")
    // ns.tprint(ns.codingcontract.getData("contract-934199-Netburners.cct", "sigma-cosmetics"));
}