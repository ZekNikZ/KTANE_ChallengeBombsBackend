import * as status from '../../../util/status';
import {
    createPack,
    deletePack,
    getAllPacks,
    updatePack,
} from '../../../db/operations/pack';
import { mustBePackOwnerOrRole, requiresRole } from '../../../roles/middleware';
import Role from '../../../enums/Role';
import { Router } from 'express';
import checkProps from '../../../util/checkProps';
import { getUser } from '../../../db/operations/user';
import { loadPack } from '../../../util/loadData';

const router = Router();

router
    .route('/')
    .get(async (req, res) => {
        res.send(await getAllPacks());
    })
    .post(requiresRole(Role.USER), async (req, res) => {
        if (!checkProps(req.body, 'name', 'workshopURL', 'previewURL')) {
            status.badRequest(res);
            return;
        }

        const { name, workshopURL, previewURL } = req.body;

        const owner = await getUser(req.body.owner);

        const pack = await createPack(
            owner || req.user?.dbObj,
            name,
            workshopURL,
            previewURL
        );

        res.send(pack);
    });

router
    .route('/:pack_id')
    .all(loadPack())
    .get((req, res) => {
        res.send(req.data?.pack);
    })
    .put(mustBePackOwnerOrRole(Role.MODERATOR), async (req, res) => {
        const pack = await updatePack(req.data?.pack, req.body);
        if (pack) {
            res.send(pack);
        } else {
            status.badRequest(res);
        }
    })
    .delete(mustBePackOwnerOrRole(Role.MODERATOR), async (req, res) => {
        if (await deletePack(req.data?.pack)) {
            status.success(res);
        } else {
            status.serverError(res);
        }
    });

export default router;
