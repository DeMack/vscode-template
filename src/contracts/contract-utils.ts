
export function factorialDivision(n: number, d: number): number {
    if (n === 0 || n === 1 || n === d) return 1;

    return factorialDivision(n - 1, d) * n;
}
