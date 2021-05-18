import * as status from '../../../util/status';
import { NextFunction, Request, Response, Router } from 'express';
import { mustBeOwner, requiresRole } from '../../../roles/middleware';
import AccessToken from '../../../db/models/AccessToken';
import Role from '../../../enums/Role';
import User from '../../../db/models/User';
import { getRepository } from 'typeorm';
import { noApiKeyAccess } from '../../../auth/middleware';
import { randomHexString } from '../../../util/random';

async function getUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    // Get the user information
    const user = await getRepository(User).findOne({
        id: req.params.user_id,
    });

    // If the user was not found, send 404
    if (!user) {
        status.notFound(res);
        return;
    }

    // Add category to request data
    req.data = { user };
    next();
}

async function getTokenInfo(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    // Get the token information
    const token = await getRepository(AccessToken).findOne({
        token: req.params.token_id,
    });

    // If the token was not found, send 404
    if (!token) {
        status.notFound(res);
        return;
    }

    // Add category to request data
    req.data = { token };
    next();
}

const router = Router();

router.get('/', requiresRole(Role.ADMIN), async (req, res) => {
    // Send user data
    res.send(await getRepository(User).find());
});

router
    .route('/:user_id/tokens')
    .get(mustBeOwner(), noApiKeyAccess(), getUserInfo, async (req, res) => {
        res.send(
            await getRepository(AccessToken).find({ owner: req.data?.user })
        );
    })
    .post(mustBeOwner(), noApiKeyAccess(), getUserInfo, async (req, res) => {
        // Body parsing
        if (!req.body.name) {
            status.badRequest(res, '"name" field missing or invalid');
            return;
        }

        // Check for duplicate name
        const tokenRepository = getRepository(AccessToken);
        if (
            (
                await tokenRepository.findAndCount({
                    owner: req.data?.user,
                    name: req.body.name,
                })
            )[1] !== 0
        ) {
            status.badRequest(res, 'duplicate name not allowed');
            return;
        }

        // Generate token
        let done = false;
        let result: { owner?: User; name: string; token: string } = {
            name: '',
            token: '',
        };
        while (!done) {
            try {
                const token = randomHexString();
                result = Object.assign(
                    {},
                    await tokenRepository.save(
                        new AccessToken(req.data?.user, req.body.name, token)
                    )
                );
                done = true;
                // eslint-disable-next-line no-empty
            } catch (error) {}
        }

        result.owner = undefined;
        res.send(result);
    });

router.delete(
    '/:user_id/tokens/:token_id',
    mustBeOwner(),
    noApiKeyAccess(),
    getUserInfo,
    getTokenInfo,
    async (req, res) => {
        // Delete the token
        try {
            await getRepository(AccessToken).delete({
                token: req.params.token_id,
            });
            status.success(res);
        } catch (error) {
            status.badRequest(res);
        }
    }
);

export default router;
