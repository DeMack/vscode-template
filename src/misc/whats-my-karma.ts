import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    // @ts-expect-error This is a hidden api
    ns.tprint(ns.heart.break());
}