/*
2^0: size: 1GB -- cost: $55.000k/pserv -- total: $1.375m
2^1: size: 2GB -- cost: $110.000k/pserv -- total: $2.750m
2^2: size: 4GB -- cost: $220.000k/pserv -- total: $5.500m
2^3: size: 8GB -- cost: $440.000k/pserv -- total: $11.000m
2^4: size: 16GB -- cost: $880.000k/pserv -- total: $22.000m
2^5: size: 32GB -- cost: $1.760m/pserv -- total: $44.000m
2^6: size: 64GB -- cost: $3.520m/pserv -- total: $88.000m
2^7: size: 128GB -- cost: $7.040m/pserv -- total: $176.000m
2^8: size: 256GB -- cost: $14.080m/pserv -- total: $352.000m
2^9: size: 512GB -- cost: $28.160m/pserv -- total: $704.000m
2^10: size: 1.024TB -- cost: $56.320m/pserv -- total: $1.408b
Max: size: 1.049PB (1048576) -- cost: $57.672b/pserv -- total: $1.442t
*/

import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    if (!ns.args || typeof ns.args[0] !== "number") throw "args[0] must be provided, and must be a number";

    const ramSize = ns.args[0];
    const skipSleep = ns.args.includes("skip") || ns.args.includes("-s");

    const scripts = [
        "/home/home-grow-template.js",
        "/home/home-weaken-template.js"
    ]

    const targets = [
        "joesguns",
        "max-hardware",
        // "silver-helix",
        // "rothman-uni"
    ]

    let targetsValues = targets.values();
    let curTarget = targetsValues.next();
    let isGrow = true;

    for (let i = 0; i < ns.getPurchasedServerLimit();) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ramSize)) {
            const hostname = ns.purchaseServer("pserv", ramSize);

            if (!hostname || hostname.length <= 0) throw "No server purchased. Check max size not reached and enough money exists.";

            if (curTarget.done) {
                targetsValues = targets.values();
                curTarget = targetsValues.next();
            }
            const curScript = scripts[isGrow ? 0 : 1];

            await ns.scp(curScript, hostname);

            const numOfThreads = Math.floor(ramSize / ns.getScriptRam(curScript, hostname));

            ns.exec(curScript, hostname, numOfThreads, curTarget.value);

            isGrow = !isGrow;
            if (isGrow) curTarget = targetsValues.next();
            i++;
        }

        if (!skipSleep) await ns.sleep(10_000);
    }
}