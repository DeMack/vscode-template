import { NS } from '@ns'
import IContractSolver, { ContractDataTypes } from '/contracts/contract-daemon';
import { factorialDivision } from './contract-utils';

/*
Unique Paths in a Grid I

You are in a grid with 9 rows and 9 columns, and you are positioned in the top-left corner of that grid. 
You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. 
Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an array with the number of rows and columns:

[9, 9] <- Data example
12870  <- Anser
*/

export async function main(ns: NS): Promise<void> {
  ns.tprint(pathsInGridISolver([9, 9]));
}

export const pathsInGridISolver: IContractSolver = function (data: ContractDataTypes) {
  if (!Array.isArray(data) || data.some((it) => typeof it !== "number")) throw TypeError("Invalid data passed to Unique Paths in a Grid I solver");

  data = data as number[];

  const rightMoves = data[0] - 1
  const downMoves = data[1] - 1

  return Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / factorialDivision(downMoves, 1))
}
