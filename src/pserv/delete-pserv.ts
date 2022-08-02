import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.scan()
        .filter((hostname) => hostname.startsWith("pserv"))
        .forEach((hostname) => {
            ns.killall(hostname);
            ns.deleteServer(hostname);
        });
} 