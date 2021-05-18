import * as status from './status';
import { EntityTarget, getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import Pack from '../db/models/Pack';
import User from '../db/models/User';

export default function loadData(
    entityClass: EntityTarget<unknown>,
    parameter: string,
    queryField: string,
    dataField: string
) {
    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // Get the object information
        const obj = await getRepository(entityClass).findOne({
            [queryField]: req.params[parameter],
        });

        // If the object was not found, send 404
        if (!obj) {
            status.notFound(res);
            return;
        }

        // Add object to request data
        if (!req.data) {
            req.data = {};
        }
        req.data = { [dataField]: obj, ...req.data };

        next();
    };
}

type LoadFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const loadUser = (): LoadFunction =>
    loadData(User, 'user_id', 'id', 'user');
export const loadPack = (): LoadFunction =>
    loadData(Pack, 'pack_id', 'name', 'pack');
export const loadMission = (): LoadFunction =>
    loadData(Pack, 'mission_id', 'missionId', 'mission');
