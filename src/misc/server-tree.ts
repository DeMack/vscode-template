// TODO: These nodes are actually more of a graph.
//	This could be a really good way to play around with those.

// Visual aide:
//	>	home
//	|	>	A
//	|	>	B
//	|	|	>	C
//	|	>	D
//	>	E

const home = "home";

export default class ServerTree {
    // TODO: This filter does not actually work the way I originally planned
    static buildTree(ns: NS, filter: (host: string) => boolean = () => true): ServerTree {
        ns.tprint("Building tree from scratch");
        const allNodes = new Map<string, string[]>();

        (function findConnections(host: string) {
            if (!allNodes.has(host) && filter(host)) {
                ns.print(`Adding node ${host} to tree`);
                const hostConnections = ns.scan(host);
                allNodes.set(host, hostConnections);
                hostConnections.forEach((conn) => findConnections(conn));
            }
        })(home);

        return new ServerTree(home, allNodes, []);
    }

    self: string;
    branches: ServerTree[];

    constructor(self: string, allNodes: Map<string, string[]>, mappedNodes: string[]) {
        this.self = self;
        this.branches = [];
        mappedNodes.push(self);

        const branchNames = allNodes.get(self);
        branchNames?.forEach((branch) => {
            if (!mappedNodes.includes(branch)) {
                this.branches.push(new ServerTree(branch, allNodes, mappedNodes));
            }
        });
    }

    public get isLeaf(): boolean {
        return this.branches.length < 1;
    }

    mapPathForTarget(
        target: string
    ): string {
        if (this.self === target) return this.self;
        if (this.isLeaf) return "";

        for (const branch of this.branches) {
            const path = branch.mapPathForTarget(target);
            if (path.length > 0) return `${this.self}; connect ${path}`;
        }

        return "";
    }

    async traverseAndExecute(
        action: (host: string, ns: NS | null) => Promise<void>,
        followup?: (host: string, ns: NS | null) => Promise<void>,
        shouldExcludeHome = true,
        ns: NS | null = null
    ): Promise<void> {
        if (this.checkForHome(shouldExcludeHome, this.self)) await action(this.self, ns);

        for (const branch of this.branches) {
            await branch.traverseAndExecute(action, followup, shouldExcludeHome, ns);
            if (followup) await followup(this.self, ns);
        }
    }

    private checkForHome(shouldExcludeHome: boolean, hostname: string) {
        return (shouldExcludeHome && hostname !== home) || !shouldExcludeHome
    }
}
