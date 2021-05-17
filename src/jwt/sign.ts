import { SignOptions, sign as jwtSign } from 'jsonwebtoken';
import User from '../db/models/User';

const config: SignOptions = {
    algorithm: 'HS512',
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PayloadType = string | object | Buffer;

export function sign(
    payload: PayloadType,
    expiresIn?: number | string
): string {
    if (expiresIn) {
        return jwtSign(payload, process.env.JWT_SECRET || 'jwt-secret', {
            ...config,
            expiresIn,
        });
    }

    return jwtSign(payload, process.env.JWT_SECRET || 'jwt-secret', config);
}

export function createUserJWT(user: User, expiresIn?: number | string): string {
    const { id, username, role, avatarURL } = user;
    return sign({ id, username, role, avatarURL }, expiresIn);
}
