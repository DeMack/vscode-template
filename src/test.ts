import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.tprint(ns.codingcontract.getContractType("contract-934199-Netburners.cct", "sigma-cosmetics"));
    ns.tprint("------------------------------------------------------------------------------------")
    ns.tprint("------------------------------------------------------------------------------------")
    ns.tprint(ns.codingcontract.getData("contract-934199-Netburners.cct", "sigma-cosmetics"));
}