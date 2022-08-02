import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const home = "home";
    const sharingScript = "/home/sharing.js";

    const freeRam = ns.getServerMaxRam(home) - ns.getServerUsedRam(home);
    const sharingRam = ns.getScriptRam(sharingScript);
    const numOfThreads = Math.floor(freeRam / sharingRam);

    ns.run(sharingScript, numOfThreads);
}