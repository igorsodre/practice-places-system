import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { DefaultErrorResponse } from '../util/default-error-response';
import { IUser, User } from './../models/user';

export const getUsers: RequestHandler = async (req, res, next) => {
    let users: IUser[];
    try {
        users = await User.find({}, '-password');
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not get users.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }
    res.json({ data: users.map((u) => u.toObject({ getters: true })) });
};

interface ILoginBody {
    email: string;
    password: string;
}
export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body as ILoginBody;
    const user = await User.findOne({ email, password });
    if (!user) {
        return next(new DefaultErrorResponse('Invalid user or password', StatusCodes.UNAUTHORIZED));
    }
    res.json({ data: user.toObject({ getters: true }) });
};

interface ISignupBody {
    name: string;
    email: string;
    password: string;
}
export const signup: RequestHandler = async (req, res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }

    const { password, name, email } = req.body as ISignupBody;

    try {
        const alreadyExists = await User.findOne({ email });
        if (alreadyExists) {
            return next(new DefaultErrorResponse('User already exists', StatusCodes.UNPROCESSABLE_ENTITY));
        }
    } catch (err) {
        return next(
            new DefaultErrorResponse('Something went wrong, could not create user.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    let newUser: IUser;
    try {
        newUser = new User(<IUser>{
            email,
            name,
            password,
            image: req.file.path,
            places: [] as unknown[],
        });
        await newUser.save();
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not create user.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    res.status(StatusCodes.CREATED).json({ data: newUser.toObject({ getters: true }) });
};
