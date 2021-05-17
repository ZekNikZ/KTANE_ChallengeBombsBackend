import * as status from '../util/status';
import { NextFunction, Request, Response } from 'express';
import Role from './Role';
import checkRole from './checkRole';
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
            if (req.params.user_id !== req.user?.id) {
                status.forbidden(res);
            } else {
                next();
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
