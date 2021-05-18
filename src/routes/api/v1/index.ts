import { Router } from 'express';
import { loadPack } from '../../../util/loadData';
import missionsRouter from './missions';
import packsRouter from './packs';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);
router.use('/packs', packsRouter);
router.use('/packs/:pack_id/missions', loadPack(), missionsRouter);

export default router;
