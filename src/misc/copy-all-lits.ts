import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

export async function main(ns: NS): Promise<void> {
    const allFiles = new Map<string, string[]>();

    await ServerTree.buildTree(ns).traverseAndExecute(async (host) => {
        const files = ns.ls(host, ".lit");
        files.forEach((filename) => {
            if (allFiles.has(filename)) allFiles.get(filename)!.push(host);
            else allFiles.set(filename, [host]);
        })
    });

    allFiles.forEach((hosts, filename) => ns.tprint(`${filename} :: ${hosts}`));
}