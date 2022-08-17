import { NS } from '@ns'
import IContractSolver, { ContractDataTypes } from '/contracts/contract-daemon';
import { pathsInGridISolver } from '/contracts/paths-in-gridi';
import { factorialDivision } from '/contracts/contract-utils';

/*
Unique Paths in a Grid II

You are located in the top-left corner of the following grid:

  x
y 0,0,0
y 0,0,0
y 0,0,0 -- 5

  x
y 0,0,0
y 0,1,0
y 0,0,0 -- 2

  x
y 0,0,0,0,0,0
y 0,0,0,0,0,0
y 1,1,1,0,1,0

  x
y 0,0,0,0,0,0,0,1,0,0,
y 0,0,0,0,0,0,0,0,0,0,
y 1,1,1,0,1,0,0,0,0,0,

  x
y 0,0,0,0,0,0,0,0,0,
y 0,0,0,0,0,0,0,0,0,
y 0,0,0,0,1,0,1,1,0,
y 0,0,0,0,0,0,0,0,0,
y 0,0,0,0,0,0,0,0,0,

[[0,0,0],[0,0,0],[0,0,0]]
[[0,0,0],[0,1,0],[0,0,0]]
[[0,0,0,0,0,0],[0,0,0,0,0,0],[1,1,1,0,1,0]] <- Data example
[[0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0],[1,1,1,0,1,0,0,0,0,0]] <- Data example
[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,1,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]] <- Data example

You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. 
These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
*/

// attempt 1: 361 X

export async function main(ns: NS): Promise<void> {
  ns.tprint(pathsInGridIISolver([[0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 1, 0, 0, 0, 0, 0]]));
}

export const pathsInGridIISolver: IContractSolver = function (data: ContractDataTypes) {
  if (!Array.isArray(data) || data.some((it) => !Array.isArray(it))) throw TypeError("Invalid data passed to Unique Paths in a Grid II solver");

  return solve(data as number[][])
}

function solve(data: number[][], ignoreFirst = false, ignoreLast = false) {
  const rightMoves = data[0].length - 1;
  const downMoves = data.length - 1;

  let totalPossiblePaths = Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / factorialDivision(downMoves, 1));

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === 1 && (!ignoreFirst || (i !== 0 || j !== 0)) && (!ignoreLast || (i !== data.length - 1 || j !== data[i].length - 1))) {
        const newArray = [];
        for (let k = i; k < data.length; k++) {
          newArray.push(data[k].slice(j, data[i].length));
        }

        let removedPaths = solve(newArray, true, ignoreLast);
        removedPaths *= pathsInGridISolver([i + 1, j + 1]) as number;

        totalPossiblePaths -= removedPaths;
      }
    }
  }

  return totalPossiblePaths;
}
