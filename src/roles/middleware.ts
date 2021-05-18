import * as status from '../util/status';
import { NextFunction, Request, Response } from 'express';
import Mission from '../db/models/Mission';
import Pack from '../db/models/Pack';
import Role from '../enums/Role';
import checkRole from './checkRole';
import { getRepository } from 'typeorm';
import { needsAuth } from '../auth/middleware';

export function requiresRole(role: Role) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        function roleCheck() {
            // Check permissions
            if (!checkRole(req.user?.role, role)) {
                status.forbidden(res);
            } else {
                next();
            }
        }

        // Call auth middleware first if necessary
        if (!req.user) {
            needsAuth()(req, res, roleCheck);
        } else {
            roleCheck();
        }
    };
}

export function mustBeOwner() {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        function permCheck() {
            // Check permissions
            if (req.params.user_id === req.user?.id) {
                next();
            } else {
                status.forbidden(res);
            }
        }

        // Call auth middleware first if necessary
        if (!req.user) {
            needsAuth()(req, res, permCheck);
        } else {
            permCheck();
        }
    };
}

export function mustBeOwnerOrRole(role: Role) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        function permCheck() {
            // Check permissions
            if (req.params.user_id === req.user?.id || req.user?.role >= role) {
                next();
            } else {
                status.forbidden(res);
            }
        }

        // Call auth middleware first if necessary
        if (!req.user) {
            needsAuth()(req, res, permCheck);
        } else {
            permCheck();
        }
    };
}

export function mustBeMissionOwnerOrRole(role: Role) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        async function permCheck() {
            // Get mission owner
            if (!req.data?.mission) {
                status.badRequest(res);
                return;
            }
            const owner = (
                await getRepository(Mission).findOne(req.data.mission, {
                    relations: ['pack', 'pack.owner'],
                })
            )?.pack?.owner;

            // Check permissions
            if (owner?.id === req.user?.id || req.user?.role >= role) {
                next();
            } else {
                status.forbidden(res);
            }
        }

        // Call auth middleware first if necessary
        if (!req.user) {
            needsAuth()(req, res, permCheck);
        } else {
            await permCheck();
        }
    };
}

export function mustBePackOwnerOrRole(role: Role) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        async function permCheck() {
            // Get pack owner
            if (!req.data?.mission) {
                status.badRequest(res);
                return;
            }
            const owner = (
                await getRepository(Pack).findOne(req.data.pack, {
                    relations: ['owner'],
                })
            )?.owner;

            // Check permissions
            if (owner?.id === req.user?.id || req.user?.role >= role) {
                next();
            } else {
                status.forbidden(res);
            }
        }

        // Call auth middleware first if necessary
        if (!req.user) {
            needsAuth()(req, res, permCheck);
        } else {
            await permCheck();
        }
    };
}
