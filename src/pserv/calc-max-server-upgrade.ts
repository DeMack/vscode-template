import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    /** Defaulted to 16, as the base server purchase script is set to 8 */
    const maxCost: number = ns.args && typeof ns.args[0] === "number" ? ns.args[0] : 2_000_000;

    const maxNumOfServers = ns.getPurchasedServerLimit();
    const maxRam = ns.getPurchasedServerMaxRam();

    /*
    1 - $1.375m -- 0::1::
    2 - $2.750m
    4 - $5.500m
    8 - $11.000m
    */

    let curPow = 0;
    let curRam = 2 ** curPow;
    let curCost = 1_375_000;
    let upgradeRam = curRam;
    let upgradeCost = 1_375_000;
    while (curRam <= maxRam && curCost <= maxCost) {
        upgradeRam = curRam;
        upgradeCost = curCost;

        curRam = 2 ** ++curPow;
        curCost = ns.getPurchasedServerCost(curRam) * maxNumOfServers;
        ns.tprint(`Next calc:: ram:${ns.nFormat(curRam * 1_000_000_000, "0.000b")} -- cost:${ns.nFormat(curCost, "$0.000a")}`);
    }

    ns.tprint(`Max possible upgrade for ${ns.nFormat(maxCost, "$0.000a")} is ${upgradeRam} and will cost ${ns.nFormat(upgradeCost, "0.000a")}`);
}