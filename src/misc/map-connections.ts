import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

export async function main(ns: NS): Promise<void> {
    if (!ns.args || ns.args.length < 1 || typeof ns.args[0] !== "string") throw "arg[0]::toFind is required"

    const tree = ServerTree.buildTree(ns);
    ns.tprint(`connect ${tree.mapPathForTarget(ns.args[0])}`);
}