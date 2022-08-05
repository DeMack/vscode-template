// Spiralize Matrix
// You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

// Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

//     [
//         [23]
//         [47]
//         [ 2]
//         [26]
//         [48]
//         [29]
//         [48]
//         [27]
//         [30]
//         [18]
//         [24]
//         [10]
//         [14]
//         [50]
//         [ 9]
//     ]

// Here is an example of what spiral order should be:

//     [
//         [1, 2, 3]
//         [4, 5, 6]
//         [7, 8, 9]
//     ]

// Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

// Note that the matrix will not always be square:

//     [
//         [1,  2,  3,  4]
//         [5,  6,  7,  8]
//         [9, 10, 11, 12]
//     ]

// Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    // NOTE: I can find the height by flooring the sqrt and then just looping down until I find { it % totalCount === 0 }

    const width = 5;

    const nums = [
        [23],
        [47],
        [2],
        [26],
        [48],
        [29],
        [48],
        [27],
        [30],
        [18],
        [24],
        [10],
        [14],
        [50],
        [9]
    ].flatMap((inner) => inner[0]);

    ns.tprint(nums); // [23,47,2,26,48,29,48,27,30,18,24,10,14,50,9]

    const matrix: number[][] = [];
    for (let i = 0; i < nums.length; i += width) {
        const inner: number[] = []
        for (let w = 0; w < width; w++) {
            inner.push(nums[i + w]);
        }
        matrix.push(inner);
    }

    const strMatrix = `[\n\t[${matrix.join("],\n\t[")}]\n]`;
    ns.tprint(strMatrix);
    // [
    //     [23, 47, 2, 26, 48],
    //     [29, 48, 27, 30, 18],
    //     [24, 10, 14, 50, 9]
    // ]
    // expected result: 2,9,10,14,18,29,50,48,47,30,23,24,26,27

    const numOfRounds = matrix.length * matrix[0].length;
    if (numOfRounds !== 15) throw "Round limit calc off";

    let widthStart = 0;
    let widthLimit = 5;
    let widthMultiplier = 1;
    let heightStart = 1;
    let heightLimit = 3;
    let heightMultiplier = 1;

    const answer: number[] = [];

    moveWidth(0, widthStart, widthLimit);
    ns.tprint(answer.join());

    function moveWidth(h: number, start: number, limit: number) {
        if (answer.length === numOfRounds) return;

        ns.tprint("Calculating width");

        let w = start;
        while (w != limit) {
            if (Math.abs(w) === numOfRounds) {
                ns.tprint(answer);
                throw "Width loop got too wide";
            }

            ns.tprint(`Pushing (h:${h}, w:${w}) -- Round ${answer.length}`);
            answer.push(matrix[h][w]);
            w += widthMultiplier;
        }

        widthMultiplier *= -1
        widthLimit = start + widthMultiplier;
        widthStart = limit + (widthMultiplier * 2);

        moveHeight(w + widthMultiplier, heightStart, heightLimit);
    }

    function moveHeight(w: number, start: number, limit: number) {
        if (answer.length === numOfRounds) return;

        ns.tprint("Calculating height");

        let h = start;
        while (h != limit) {
            if (Math.abs(h) === numOfRounds) {
                ns.tprint(answer);
                throw "Height loop got too wide";
            }

            ns.tprint(`Pushing (h:${h}, w:${w}) -- Round ${answer.length}`);
            answer.push(matrix[h][w]);
            h += heightMultiplier;
        }

        heightMultiplier *= -1;
        heightLimit = start + heightMultiplier;
        heightStart = limit + (heightMultiplier * 2);

        moveWidth(h + heightMultiplier, widthStart, widthLimit);
    }
}