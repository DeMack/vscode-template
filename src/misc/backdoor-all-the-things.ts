import { NS } from '@ns'
import ServerTree from 'misc/server-tree'

// TODO: Collect and print a list of all failed servers
// TODO: If "parent" node is home, don't `connect home` just `home`
// TODO: Fix filter to filter out pservs

// Note: Last run -- 1:30:10:856
export async function main(ns: NS): Promise<void> {
    if (ns.args.length > 0 && ns.args.includes("help")) {
        ns.tprint(`
            Creates a tree of all connected nodes, and then traverses that tree depth-first and backdoors each node.
            While this script is running, the UI must be left on the terminal, otherwise it will not work.
            NOTE: This may take a while.

            Notes about possible args:
            - If args includes "help" anywhere, this text will be printed, and the program exited.
            - args[0], if included and not "help", should be numeric. It will represent the maximum number of
            ports required for hacking. This is included as a helper for earlier gameplay where not all hacking
            programs have been obtained.
            - If args[0] is not included, the port threshold will be defaulted to 5.`);
        return;
    }

    const authRejection = "node not yet hacked";
    const hackingSkillRejection = "higher hacking skill required";
    const pservRejection = "attempted to hack your own servers"

    const portThreshold: number | string | boolean = ns.args[0] ? ns.args[0] : 5;

    const tree = ServerTree.buildTree(ns, function (hostname) {
        const server = ns.getServer(hostname);
        return server.numOpenPortsRequired <= portThreshold;
    });

    const promptResult = await ns.prompt(
        "WARNING: This script takes time to run. \nYou will not be able to leave the terminal until completion. \nAre you sure you wish to continue?",
        { type: "boolean" }
    );

    if (!promptResult) {
        ns.alert("Process has been aborted. Exiting.");
        return;
    }

    ns.tprint("!!!!!!!! WARNING: This script takes time to run. DO NOT leave the terminal until completion.");
    // sleep to allow for the warning to be read before running
    // TODO: Potentially create an alert that waits for a keystroke to continue
    await ns.sleep(1500);

    const startTime = new Date();

    await tree.traverseAndExecute(connectAndBackdoorServer, reconnectToParent);

    // @ts-expect-error: Dates can be subtracted safely. It will return a numeric value of the milliseconds of the difference.
    const duration = new Date(new Date() - startTime);
    ns.tprint(`${duration.getUTCHours()}:${duration.getUTCMinutes()}:${duration.getUTCSeconds()}:${duration.getUTCMilliseconds()}`);

    /**
     * Connects to and backdoors a given host
     * @param hostname
     */
    async function connectAndBackdoorServer(hostname: string) {
        ns.tprint(`Attempting to backdoor ${hostname}`);

        if (hostname === "home" || hostname.startsWith("pserv")) return;

        doAction(`connect ${hostname}; backdoor`);
        // TODO: Instead of printing these, just collect them in the final list and then print it all in the end
        // TODO: Possibly write them to a file so that they can be referenced later
        await waitForBackdoorToComplete(hostname)
            .catch((rejected: string) => {
                if (rejected.includes(authRejection)) {
                    ns.tprint(`${rejected} -- remember to run /misc/crack-all-the-things.js`);
                } else if (rejected.includes(hackingSkillRejection)) {
                    ns.tprint(`${rejected} -- remember to rerun later with higher hacking skill`);
                } else if (rejected.includes(pservRejection)) {
                    ns.tprint(`${rejected} -- No need to backdoor this server. Skipping.`);
                } else {
                    ns.tprint(rejected);
                }
            });
    }

    /**
     * Returns the connection to the parent node in order to continue to the next;
     * @param parentHostname
     */
    async function reconnectToParent(parentHostname: string) {
        ns.tprint(`Reconnecting to parent node: ${parentHostname}`);
        doAction(`connect ${parentHostname}`);
    }

    function doAction(action: string) {
        const terminalInput: HTMLElement = document.getElementById("terminal-input")!;
        // @ts-expect-error: This does exist in this case
        terminalInput.value = action;
        const handler = Object.keys(terminalInput)[1];
        // @ts-expect-error: This does work here
        terminalInput[handler].onChange({ target: terminalInput });
        // @ts-expect-error: This does work here
        terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
    }

    /**
     * Wait in an "infinite" loop for the backdoor to complete. This loop contains a single second wait
     *  for every iteration to prevent overloading and freezing. Since this can only be run while watching
     *  the terminal, it should be obvious when something is not working, and the script killed.
     * @param hostname 
     * @returns Promise will be void if successful or throw an error if not
     */
    async function waitForBackdoorToComplete(hostname: string) {
        while (true) {
            // NOTE: This sleep has to be at the start of the loop to allow time for the dom to update
            //  when evaluating to make sure that the last line isn't stale data.
            await ns.sleep(1000);

            const terminal = document.getElementById("terminal")!;
            const lines = terminal.getElementsByTagName("li")!;
            const curLine = lines[lines.length - 1].innerText;

            if (curLine.includes(`Backdoor on '${hostname}' successful`)) {
                ns.tprint(`backdoor for ${hostname} complete`);
                return;
            } else if (curLine.includes("You do not have admin rights")) {
                throw `${hostname}::${authRejection}`;
            } else if (curLine.includes("hacking skill")) {
                throw `${hostname}::${hackingSkillRejection}`;
            }
        }
    }
}