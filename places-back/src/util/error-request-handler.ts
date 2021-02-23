import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DefaultErrorResponse } from './DefaultErrorResponse';

export const defaultErrorRequestHandler: ErrorRequestHandler = (error, _, res, next) => {
	if (res.headersSent) {
		return next(error);
	}
	res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || 'An unknown error occurred!' });
};

export const defaultNotFoundResponse: RequestHandler = (_, res, next) => {
	return next(new DefaultErrorResponse('Could not find this route.', StatusCodes.NOT_FOUND));
};
