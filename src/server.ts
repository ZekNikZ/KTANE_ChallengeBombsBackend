// Misc imports
import * as status from './util/status';
import express, { NextFunction, Request, Response } from 'express';
import { applyInsecureJWT } from './jwt/middleware';
import multer from 'multer';

// Routers
import apiRouter from './routes/api/v1/';
import authRouter from './routes/auth/discordoauth';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors()); // TODO: more specific CORS policy
app.use(express.json());
applyInsecureJWT(app);

// Apply routes
app.use('/auth', authRouter);
app.use('/api/v1', apiRouter);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({
            error: 'Unauthorized',
            message: err.message,
        });
        return;
    } else if (err.code === 'permission_denied') {
        res.status(403).send({ error: 'Forbidden' });
        return;
    } else if (err.name === 'MulterError') {
        status.badRequest(res);
        return;
    }
    next(err);
});

export default app;
