import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    if (!ns.args || ns.args.length < 2) throw "Too few arguments provided. Initial sleep time and target are required";

    const sleepTime = ns.args[0]
    if (typeof sleepTime !== "number") throw "Invalid sleep time provided. Must be a number";
    await ns.sleep(sleepTime);

    const target = ns.args[1];
    if (typeof target !== "string") throw "Invalid target provided. Must be a string"
    ns.print(`hacking target: ${target}`);
    await ns.hack(target);
}