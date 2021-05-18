export default function checkProps(
    obj: Record<string, unknown>,
    ...propNames: string[]
): boolean {
    for (const prop of propNames) {
        if (!obj[prop]) {
            return false;
        }
    }

    return true;
}
