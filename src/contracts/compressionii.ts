import { NS } from '@ns'
import IContractSolver from '/contracts/contract-daemon';

/*
Compression II: LZ Decompression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. 
In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: 
each of the L output characters is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. 
The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

You are given the following LZ-encoded string:
    93Wq0DqSXd04hNaw376CAFsFs6812939DzD0Nm1fL096FKJmNIlg129l2wFZ3YN6194bEU7442U7
Decode it and output the original string.

Example: decoding '5aaabb450723abb' chunk-by-chunk
    5aaabb           ->  aaabb
    5aaabb45         ->  aaabbaaab
    5aaabb450        ->  aaabbaaab
    5aaabb45072      ->  aaabbaaababababa
    5aaabb450723abb  ->  aaabbaaababababaabb

---

Data Example: 93Wq0DqSXd04hNaw376CAFsFs6812939DzD0Nm1fL096FKJmNIlg129l2wFZ3YN6194bEU7442U7
Answer:       3Wq0DqSXdhNawSXdCAFsFsXdCAFs2Fs2Fs2Fs2DzD0Nm1fL6FKJmNIlgll2wFZ3YN6lbEU7bEU7U7

Expected size: 77

Chunks: 
- 9:  3Wq0DqSXd
- 0:
- 4:  hNaw
- 37: SXd
- 6:  CAFsFs
- 68: XdCAFs
- 1:  2
- 93: Fs2Fs2Fs2
- 9:  DzD0Nm1fL
- 0: 
- 9:  6FKJmNIlg
- 12: l
- 9:  l2wFZ3YN6
- 19: l
- 4:  bEU7
- 44: bEU7
- 2:  U7

---

Data Example: 3GS4536th3IjL661j434E166770349k6j6IK6pS04W2yc479gtPt23urF383u3S
Answer: GS4GS4GSth3IjLth3IjLjjLjjE166LjjE166E16k6j6IK6pSW2yc6pSWgtPt23urFtPtu3S

Chunks:
- 3:  GS4
- 53: GS4GS
- 6:  th3IjL
- 66: th3IjL
- 1:  j
- 43: jLjj
- 4:  E166
- 77: LjjE166
- 0:
- 34: E16
- 9:  k6j6IK6pS
- 0: 
- 4:  W2yc
- 47: 6pSW
- 9:  gtPt23urF
- 38: 
- 3:  u3S
*/

export async function main(ns: NS): Promise<void> {
    // Make sure to check that the start(s) of a new chunk is numeric
    // const data = "5aaabb450723abb";
    // const expected = "aaabbaaababababaabb";
    const data = "3GS4536th3IjL661j434E166770349k6j6IK6pS04W2yc479gtPt23urF383u3S";
    const expected = "GS4GS4GSth3IjLth3IjLjjLjjE166LjjE166E16k6j6IK6pSW2yc6pSWgtPt23urFtPtu3S";

    const result = compressionIISolver(data) as string;
    ns.tprint(result);
    ns.tprint(`\nResult was accurate: ${result === expected}\n${result}`);
}

export const compressionIISolver: IContractSolver = function (data: string | number[] | number[][]): string {
    if (typeof data !== "string") throw TypeError("Invalid data passed to Compression II: LZ Decompression solver");
    data = data as string;
    const builder: string[] = [];

    let isTypeA = true;
    let blockstart = 0;

    while (blockstart < data.length) {
        const blockLength = parseInt(data[blockstart]);

        if (blockLength === 0) {
            blockstart++;
        } else if (isTypeA) {
            populateTypeA(blockstart + 1, blockLength);
            blockstart += blockLength + 1;
        } else {
            populateTypeB(blockLength, parseInt(data[blockstart + 1]));
            blockstart += 2;
        }

        isTypeA = !isTypeA;
    }

    return builder.join("");

    function populateTypeA(startIdx: number, length: number) {
        data = data as string
        builder.push(...data.slice(startIdx, startIdx + length));
    }

    function populateTypeB(numOfDigits: number, reverseStartIdx: number) {
        data = data as string
        for (let i = 0; i < numOfDigits; i++) {
            builder.push(builder[builder.length - reverseStartIdx]);
        }
    }
}