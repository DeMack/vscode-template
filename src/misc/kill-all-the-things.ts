import { NS } from '@ns'
import ServerTree from '/misc/server-tree'

export async function main(ns: NS): Promise<void> {
    await ServerTree.buildTree(ns).traverseAndExecute((hostname) => {
        if (hostname !== "home") ns.killall(hostname);
        return Promise.resolve();
    });
}