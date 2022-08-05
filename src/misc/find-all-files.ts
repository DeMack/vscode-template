import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

/*
/misc/find-all-files.js: sector-12-crime.lit :: foodnstuff,alpha-ent
/misc/find-all-files.js: democracy-is-dead.lit :: avmnite-02h,I.I.I.I,CSEC
/misc/find-all-files.js: secret-societies.lit :: summit-uni,rothman-uni
/misc/find-all-files.js: synthetic-muscles.lit :: summit-uni,microdyne,zb-def
/misc/find-all-files.js: the-failed-frontier.lit :: summit-uni,rothman-uni,solaris
/misc/find-all-files.js: contract-600296.cct :: aerocorp
/misc/find-all-files.js: man-and-machine.lit :: aerocorp,computek
/misc/find-all-files.js: A-Green-Tomorrow.lit :: global-pharm,taiyang-digital,vitalife,solaris
/misc/find-all-files.js: brighter-than-the-sun.lit :: taiyang-digital,hong-fang-tea
/misc/find-all-files.js: coded-intelligence.lit :: titan-labs,omnitek
/misc/find-all-files.js: simulated-reality.lit :: fulcrumtech,run4theh111z,netlink
/misc/find-all-files.js: history-of-synthoids.lit :: omnitek,omnia
/misc/find-all-files.js: beyond-man.lit :: helios,blade,clarkinc
/misc/find-all-files.js: the-hidden-world.lit :: nwo,neo-net
/misc/find-all-files.js: cost-of-immortality.lit :: clarkinc
/misc/find-all-files.js: contract-986805.cct :: powerhouse-fitness
/misc/find-all-files.js: alpha-omega.lit :: The-Cave
/misc/find-all-files.js: the-new-god.lit :: run4theh111z,omega-net
/misc/find-all-files.js: tensions-in-tech-race.lit :: rothman-uni,catalyst
/misc/find-all-files.js: new-triads.lit :: silver-helix
*/

// TODO: Update this name to be copy all lit and create another true find all
export async function main(ns: NS): Promise<void> {
    const allFiles = new Map<string, string[]>();

    await ServerTree.buildTree(ns).traverseAndExecute(async (host) => {
        const files = ns.ls(host, ".lit");
        files.forEach((filename) => {
            if (allFiles.has(filename)) allFiles.get(filename)!.push(host);
            else allFiles.set(filename, [host]);
        })
    });

    allFiles.forEach((hosts, filename) => ns.tprint(`${filename} :: ${hosts}`));
}