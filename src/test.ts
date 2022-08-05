import { NS } from '@ns'
import { validateArgs } from 'misc/utils'

export async function main(ns: NS): Promise<void> {
    ns.tprint(validateArgs(ns.args, 3, ["string", "string", "number"], () => [false, "Custom false msg"]));
}