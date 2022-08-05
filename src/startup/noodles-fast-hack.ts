import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    while (ns.getHackingLevel() <= 10) {
        await ns.hack("n00dles");
    }

    ns.alert("Fast hack on n00dles complete. May be hacked normally");
}