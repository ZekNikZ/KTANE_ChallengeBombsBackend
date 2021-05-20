import { Router } from 'express';
import { loadPack } from '../../../util/loadData';
import missionsRouter from './missions';
import packMissionsRouter from './pack-missions';
import packsRouter from './packs';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);
router.use('/packs', packsRouter);
router.use('/missions', missionsRouter);
router.use('/packs/:pack_id/missions', loadPack(), packMissionsRouter);

export default router;
