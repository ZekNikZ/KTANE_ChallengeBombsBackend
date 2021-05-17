import { randomBytes } from 'crypto';

export function randomHexString(length = 32): string {
    return randomBytes(length / 2).toString('hex');
}
