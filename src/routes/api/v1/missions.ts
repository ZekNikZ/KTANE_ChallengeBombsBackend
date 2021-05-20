import { Router } from 'express';
import { getAllMissions } from '../../../db/operations/mission';

const router = Router();

router.route('/').get(async (req, res) => {
    res.send(await getAllMissions());
});

export default router;
