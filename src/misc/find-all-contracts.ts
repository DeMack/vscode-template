import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

export async function main(ns: NS): Promise<void> {
    const allContracts = new Map<string, string[]>()

    await ServerTree.buildTree(ns).traverseAndExecute(async (host) => {
        const contracts = ns.ls(host, ".cct");
        if (contracts.length > 0) allContracts.set(host, contracts.map((it) => `${it} -- ${ns.codingcontract.getContractType(it, host)}`));
    });

    allContracts.forEach((contracts, host) => ns.tprint(`${host}::${contracts}`));
}