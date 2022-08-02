import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const serverNameRoot = "pserv"

    /** Defaulted to 16, as the base server purchase script is set to 8 */
    const size: number = ns.args && typeof ns.args[0] === "number" ? ns.args[0] : 16;
    const totalCost = ns.getPurchasedServerCost(size) * 25

    if (ns.getPlayer().money < totalCost) throw `cannot upgrade -- not enough money available -- ${ns.nFormat(totalCost, "$0,0.000a")}`;

    //TODO: Create alert that displays the server cost and asks for confirmation?
    ns.run("/pserv/calc-pserv-upgrade-cost.js", 1, size);
    await ns.sleep(2000); // Sleep to allow for reading what's printed by the above and cancelling the script if desired
    ns.tprint("Upgrading now.");

    ns.scan("home")
        .filter((host) => host.startsWith(serverNameRoot))
        .forEach((host) => {
            ns.killall(host);
            if (!ns.deleteServer(host)) throw `Could not delete server: ${host}. Ensure no scripts are running.`;
        });

    ns.run("/pserv/purchase-server.js", 1, size, "skip");
}