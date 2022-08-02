import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    if (!ns.args || typeof ns.args[0] !== "string") throw "args[0] must be provided, and must be a string";
    while (true) {
        await ns.grow(ns.args[0]);
    }
}