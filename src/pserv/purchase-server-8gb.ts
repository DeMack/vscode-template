import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const ramSize = 8;
    const script = "/startup/hack-template.js";
    const target = "joesguns";

    for (let i = 0; i < 25;) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ramSize)) {
            const hostname = ns.purchaseServer("pserv", ramSize);

            await ns.scp(script, hostname);
            ns.exec(script, hostname, 3, target, 62500000, 8);

            i++;
        }
        await ns.sleep(10_000);
    }
}