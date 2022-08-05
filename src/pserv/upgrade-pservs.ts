import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const serverNameRoot = "pserv"
    const gb = 1_000_000_000;

    /** Defaulted to 16, as the base server purchase script is set to 8 */
    const size: number = ns.args && typeof ns.args[0] === "number" ? ns.args[0] : 16;
    const formattedSize = ns.nFormat(size * gb, "0.000b");

    const totalCost = ns.getPurchasedServerCost(size) * 25;
    const formattedCost = ns.nFormat(totalCost, "$0.000a");

    if (ns.getPurchasedServers().length > 0) {
        const currentSize = ns.getServerMaxRam("pserv");
        if (size <= currentSize) throw `Invalid upgrade size: ${formattedSize} is smaller than current capacity`;
    }

    if (ns.getPlayer().money < totalCost) throw `cannot upgrade to ${formattedSize} -- not enough money available -- ${formattedCost}`;

    const shouldContinue = await ns.prompt(
        `Cost for upgrading all purchased servers to ${formattedSize} :: ${formattedCost} \nAre you sure you'd like to contiue?`
    );

    if (!shouldContinue) {
        ns.alert("Upgrade cancelled");
        return;
    }

    ns.tprint("Upgrading now.");

    ns.scan("home")
        .filter((host) => host.startsWith(serverNameRoot))
        .forEach((host) => {
            ns.killall(host);
            if (!ns.deleteServer(host)) throw `Could not delete server: ${host}. Ensure no scripts are running.`;
        });

    ns.run("/pserv/purchase-server.js", 1, size, "skip");
}