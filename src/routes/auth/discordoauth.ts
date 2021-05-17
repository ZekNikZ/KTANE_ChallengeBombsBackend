import * as status from '../../util/status';
import {
    getAccessToken,
    getDiscordId,
    getOauthURL,
} from '../../discord/oauth2';
import { Router } from 'express';
import axios from 'axios';
import { createUserJWT } from '../../jwt/sign';
import { getOrCreateUser } from '../../db/operations/user';

const router = Router();

router
    .route('/discord/login')
    .get((req, res) => {
        res.redirect(getOauthURL());
    })
    .post(async (req, res) => {
        if (req.body?.code && req.body?.state) {
            const accessToken = await getAccessToken(req.body.code);
            const { id, username, avatar } = await getDiscordId(accessToken);
            const user = await getOrCreateUser(id, username, avatar);

            if (user) {
                res.send(createUserJWT(user));
            } else {
                status.serverError(res);
                res.send('uh oh');
            }
        } else {
            status.badRequest(res, 'missing "code" and/or "state"');
        }
    });

router.get('/discord/callback', async (req, res) => {
    // TODO: redirect to the proper place
    res.send(
        (
            await axios.post(
                `http://localhost:${
                    process.env.PORT || 3000
                }/auth/discord/login`,
                {
                    code: req.query.code,
                    state: req.query.state,
                }
            )
        ).data
    );
});

export default router;
