import * as status from '../../../util/status';
import {
    createMission,
    deleteMission,
    getAllPackMissions,
} from '../../../db/operations/mission';
import { mustBeOwnerOrRole, requiresRole } from '../../../roles/middleware';
import Role from '../../../enums/Role';
import { Router } from 'express';
import checkProps from '../../../util/checkProps';
import { loadMission } from '../../../util/loadData';

const router = Router();

router
    .route('/')
    .get(async (req, res) => {
        res.send(await getAllPackMissions(req.data?.pack));
    })
    .post(requiresRole(Role.USER), async (req, res) => {
        if (!checkProps(req.body, 'name', 'missionId')) {
            status.badRequest(res);
            return;
        }

        const { missionId, name, bombs } = req.body;

        const mission = await createMission(
            missionId,
            req.data?.pack,
            name,
            bombs
        );

        res.send(mission);
    });

router
    .route('/:mission_id')
    .all(loadMission())
    .get((req, res) => {
        res.send(req.data?.mission);
    })
    .put(mustBeOwnerOrRole(Role.MODERATOR), async (req, res) => {
        // TODO: complete
        res.send('Not implemented');
    })
    .delete(mustBeOwnerOrRole(Role.MODERATOR), async (req, res) => {
        if (await deleteMission(req.data?.mission)) {
            status.success(res);
        } else {
            status.serverError(res);
        }
    });

export default router;
