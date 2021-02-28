// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />
import { StatusCodes } from 'http-status-codes';

import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { DefaultErrorResponse } from './default-error-response';

export const preventUnauthenticated: RequestHandler = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new DefaultErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'NOT_FOUND_SECRET_KJDHSAHJSDA') as IAppTokenFormat;
        req.userData = { userId: decoded.userId };
        next();
    } catch (err) {
        return next(new DefaultErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN));
    }
};
