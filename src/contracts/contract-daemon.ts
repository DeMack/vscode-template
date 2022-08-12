import { NS } from '@ns'
import { compressionIISolver } from '/contracts/compressionii';
import { pathsInGridISolver } from '/contracts/paths-in-gridi';
import { pathsInGridIISolver } from '/contracts/paths-in-gridii';
import { subarrayWithMaximumSumSolver } from '/contracts/subarray-with-maximum-sum';
import ServerTree from '/misc/server-tree';

/*
Types:
    - Unique Paths in a Grid I
        - data: [9, 9]
        - answer: 12870
    - Unique Paths in a Grid II
        - data: [[0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0],[1,1,1,0,1,0,0,0,0,0]]
        - answer: 34
    - Subarray with Maximum Sum
        - data: [5, -6, -5, -1, 1, 10, 5, 8, -6, -3, 8, -3, -4, -7, 6, 7, 5, -7, -7, -3, 1, -9, 1, 5, 3, 5, -8, -1, 10]
        - answer: 27
    - Compression II: LZ Decompression
        - data: 93Wq0DqSXd04hNaw376CAFsFs6812939DzD0Nm1fL096FKJmNIlg129l2wFZ3YN6194bEU7442U7
        - answer: 3Wq0DqSXdhNawSXdCAFsFsXdCAFs2Fs2Fs2Fs2DzD0Nm1fL6FKJmNIlgll2wFZ3YN6lbEU7bEU7U7
*/

export async function main(ns: NS): Promise<void> {
    await ServerTree.buildTree(ns).traverseAndExecute(async (host) => {
        const contracts = ns.ls(host, ".cct");
        if (contracts.length > 0) {
            contracts.map((filename) => {
                return new Contract(
                    host,
                    filename,
                    ns.codingcontract.getContractType(filename, host),
                    ns.codingcontract.getData(filename, host)
                );
            }).forEach((contract) => {
                const solver = getSolver(contract);
                if (solver !== null) {
                    const solution: ContractSolutionTypes = solver(contract.data);
                    // @ts-expect-error The type definition for the solution is actually wrong
                    const result: string = ns.codingcontract.attempt(solution, contract.filename, contract.host, { returnReward: true }) as string;

                    if (result.length > 0) ns.tprint(`${contract.host}::${contract.filename} completed successfully\n${result}`);
                    else ns.tprint(`Attempt to solve ${contract.host}::${contract.filename} failed. Solution: ${solution}`);
                }
            });
        }
    });

    function getSolver(contract: Contract): IContractSolver | null {
        switch (contract.type) {
            case "Unique Paths in a Grid I":
                return pathsInGridISolver;
            case "Unique Paths in a Grid II":
                return pathsInGridIISolver;
            case "Compression II: LZ Decompression":
                return compressionIISolver;
            case "Subarray with Maximum Sum":
                return subarrayWithMaximumSumSolver;
            default:
                ns.tprint(`No solver found for ${contract.type} -- ${contract.host}::${contract.filename}`);
                return null;

        }
    }
}

class Contract {
    readonly host: string;
    readonly filename: string;
    readonly type: string;
    readonly data: ContractDataTypes;

    constructor(host: string, filename: string, type: string, data: ContractDataTypes) {
        this.host = host;
        this.filename = filename;
        this.type = type;
        this.data = data;
    }
}

export type ContractDataTypes = string | number[] | number[][];
export type ContractSolutionTypes = number | string | (number | string)[];

export default interface IContractSolver {
    (params: ContractDataTypes): ContractSolutionTypes;
}
