import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const maxSize = Math.ceil(Math.log(1048576) / Math.log(2));

    ns.tprint(ns.getPurchasedServerMaxRam());
    ns.tprint(maxSize);
}