import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.scan("home")
        .filter((server) => server.startsWith("pserv"))
        .forEach((server) => ns.killall(server));
}