import { NS } from '@ns'

// TODO: Another that would allow me to see just how high I can go to be under a given pricepoint
//  e.g. input: 1b would give me a result of 512gb
export async function main(ns: NS): Promise<void> {
    const gb = 1_000_000_000;

    /** Defaulted to 16, as the base server purchase script is set to 8 */
    const size: number = ns.args && typeof ns.args[0] === "number" ? ns.args[0] : 16;
    ns.tprint(`Cost for upgrading all purchased servers to ${ns.nFormat(size * gb, "0.000b")} :: ${ns.nFormat(ns.getPurchasedServerCost(size) * 25, "$0.000a")}`);
}