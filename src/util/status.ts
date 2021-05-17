import { Response } from 'express';

function error(res: Response, error: string, message?: string): void {
    if (message) {
        res.send({ error, message });
    } else {
        res.send({ error });
    }
}

function successful(res: Response, notice: string, message?: string): void {
    if (message) {
        res.send({ notice, message });
    } else {
        res.send({ notice });
    }
}

export function success(res: Response, message?: string): void {
    successful(res, 'Success', message);
}

export function notFound(res: Response, message?: string): void {
    res.status(404);
    error(res, 'Not found', message);
}
export function badRequest(res: Response, message?: string): void {
    res.status(400);
    error(res, 'Bad request', message);
}

export function serverError(res: Response, message?: string): void {
    res.status(500);
    error(res, 'Internal Server Error', message);
}

export function unauthorized(res: Response, message?: string): void {
    res.status(401);
    error(res, 'Unauthorized', message);
}

export function forbidden(res: Response, message?: string): void {
    res.status(403);
    error(res, 'Forbidden', message);
}
