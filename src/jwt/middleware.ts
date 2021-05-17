import { Router } from 'express';
import jwt from 'express-jwt';

const config = {
    secret: process.env.JWT_SECRET || 'jwt-secret',
    algorithms: ['HS512'],
};

export function applySecureJWT(app: Router): void {
    app.use(jwt(config));
}

export function applyInsecureJWT(app: Router): void {
    app.use(
        jwt({
            ...config,
            credentialsRequired: false,
        })
    );
}
