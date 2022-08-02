import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

// TODO: Add port threshold
export async function main(ns: NS): Promise<void> {

    const portThreshold: number | string | boolean = ns.args[0] ? ns.args[0] : 5;

    const tree = ServerTree.buildTree(ns);

    await tree.traverseAndExecute(crackNode);

    async function crackNode(hostname: string) {
        ns.tprint(`cracking ${hostname}`);

        /* eslint-disable no-fallthrough */
        switch (portThreshold) {
            case 5:
                ns.httpworm(hostname);
            case 4:
                ns.sqlinject(hostname);
            case 3:
                ns.relaysmtp(hostname);
            case 2:
                ns.ftpcrack(hostname);
            case 1:
                ns.brutessh(hostname);
            default:
                ns.nuke(hostname);
                break;
        }
        /* eslint-enable no-fallthrough */
    }
}