import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    // TODO: Change this to be more dynamic to both:
    //  - limit the number of possible scripts
    //  - check the current user level as well as the minimum level on each target
    const targets = [
        // "n00dles",
        "joesguns",
        // "max-hardware",
        // "silver-helix",
        // "rothman-uni",
        // "aevum-police",
        // "solaris"
    ]

    const scripts = [
        "/home/home-grow-template.js",
        "/home/home-weaken-template.js"
    ]

    ns.killall("home");

    const homeRamGbs = ns.getServerMaxRam("home");
    const scriptSize = ns.getScriptRam(scripts[0]);
    // const threadBufferSize = 50;
    const threadBufferSize = 1;
    const totalPossibleScripts = (homeRamGbs / scriptSize) - threadBufferSize;
    const instancesPerScript = Math.floor(totalPossibleScripts / scripts.length / targets.length);

    targets.forEach((target) => {
        ns.print(`running ${instancesPerScript} scripts for ${target}`)
        scripts.forEach((script) => ns.run(script, instancesPerScript, target));
    });
}