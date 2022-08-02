import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

export async function main(ns: NS): Promise<void> {
    // NOTE: This will only work with raw javascript or ns functions that incur no ram cost, e.g. ns.typrint
    if (
        !ns.args
        || ns.args.length < 1
        || ns.args.some((arg) => typeof arg !== "string")
    ) throw "Invalid args provided. Exiting.";

    // provide a default host arg when args is only the function
    // @ts-expect-error This is validated in the above if
    const hostVarName: string = ns.args.length > 1 ? ns.args.shift() : "host";

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const AsyncFunction = (async function () { }).constructor;

    // @ts-expect-error This is validated in the above if
    const fn = new AsyncFunction(hostVarName, "ns", ns.args[0]);

    await ServerTree.buildTree(ns).traverseAndExecute(fn, () => Promise.resolve(), false, ns);
}