export function between(a: number, test: number, b: number): boolean {
    return a < test && test < b;
}

export function betweenOrEqual(a: number, test: number, b: number): boolean {
    return a <= test && test <= b;
}

export function atLeast(test: number, val: number): boolean {
    return test >= val;
}
