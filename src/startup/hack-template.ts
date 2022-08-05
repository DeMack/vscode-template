import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    if (!ns.args || ns.args.length < 3) throw "Too few arguments supplied";

    if (typeof ns.args[0] !== "string") throw `Invalid target supplied: ${ns.args[0]}`;
    const target: string = ns.args[0];
    ns.print(target);

    if (typeof ns.args[1] !== "number") throw `Invalid money threshold supplied: ${ns.args[1]}`;
    const moneyThresh: number = ns.args[1];
    ns.print(moneyThresh);

    if (typeof ns.args[2] !== "number") throw `Invalid security threshold supplied: ${ns.args[2]}`;
    const securityThresh: number = ns.args[2];
    ns.print(securityThresh);

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.print(`Cur sec level: ${ns.getServerSecurityLevel(target)} -- ${securityThresh}`);
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print(`Cur money: ${ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a")} -- ${ns.nFormat(moneyThresh, "$0.000a")}`);
            await ns.grow(target);
        } else {
            ns.print("hacking");
            await ns.hack(target);
        }
    }
}