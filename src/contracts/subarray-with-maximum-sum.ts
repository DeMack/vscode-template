import { NS } from '@ns'
import IContractSolver from '/contracts/contract-daemon';

/*
Subarray with Maximum Sum

You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

Given the following integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum. 
'Sum' refers to the sum of all the numbers in the subarray.

Data Example: [5, -6, -5, -1, 1, 10, 5, 8, -6, -3, 8, -3, -4, -7, 6, 7, 5, -7, -7, -3, 1, -9, 1, 5, 3, 5, -8, -1, 10]
Answer: 27
*/

// TODO: This is a brute force solution that needs to be optimized. I need a data structure that would allow me to keep track of previous sums.
//  I'm thinking this might be done with a trie???
export async function main(ns: NS): Promise<void> {
    const data = [5, -6, -5, -1, 1, 10, 5, 8, -6, -3, 8, -3, -4, -7, 6, 7, 5, -7, -7, -3, 1, -9, 1, 5, 3, 5, -8, -1, 10];
    ns.tprint(subarrayWithMaximumSumSolver(data));
}

export const subarrayWithMaximumSumSolver: IContractSolver = function (data: string | number[] | number[][]) {
    if (!Array.isArray(data) || data.some((it) => typeof it !== "number")) throw TypeError("Invalid data passed to Subarray with Maximum Sum solver");
    data = data as number[];
    let maxSum: number | null = null;
    for (let sliceSize = 1; sliceSize <= data.length; sliceSize++) {
        for (let i = 0; i < data.length; i++) {
            const curSum = sumSlice(data.slice(i, sliceSize + i));
            // @ts-expect-error This does actually work just fine
            maxSum = Math.max(maxSum, curSum);
        }
    }
    return maxSum!;
}

function sumSlice(data: number[]): number {
    return data.reduce((prev, cur) => prev + cur);
}
