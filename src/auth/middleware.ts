import * as status from '../util/status';
import { NextFunction, Request, Response } from 'express';
import AccessToken from '../db/models/AccessToken';
import User from '../db/models/User';
import { getRepository } from 'typeorm';

async function getUser(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        const dbUser = await getRepository(User).findOne({ id: req.user.id });

        if (dbUser) {
            req.user.role = dbUser.role;
            req.user.dbObj = dbUser;
            next();
        } else {
            status.unauthorized(res, 'invalid user');
        }
    } else if (req.header('x-api-key')) {
        let token: string;
        try {
            token = req.header('x-api-key') as string;
        } catch (error) {
            status.unauthorized(res, 'invalid API key');
            return;
        }

        if (token) {
            const accessToken = await getRepository(AccessToken).findOne(
                { token },
                { relations: ['owner'] }
            );

            const id = accessToken?.owner.id;
            if (id) {
                req.user = { id, apiKey: true };
                next();
            } else {
                status.unauthorized(res, 'invalid API key');
                return;
            }
        } else {
            status.unauthorized(res, 'invalid API key');
            return;
        }
    } else {
        status.unauthorized(res);
        return;
    }
}

export function needsAuth() {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if ((!req.user || !req.user.id) && !req.header('x-api-key')) {
            status.unauthorized(res, 'no authentication token present');
            return;
        }

        getUser(req, res, next);
    };
}

export function acceptsAuth() {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (!req.user && !req.header('x-api-key')) {
            next();
            return;
        }

        getUser(req, res, next);
    };
}

export function noApiKeyAccess() {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (req.user?.apiKey) {
            status.forbidden(res, 'you cannot use an API key on this endpoint');
            return;
        }

        next();
    };
}
