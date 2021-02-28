import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
    let user: Nullable<IUser>;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return next(new DefaultErrorResponse('Invalid user or password', StatusCodes.FORBIDDEN));
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(new DefaultErrorResponse('Invalid user or password', StatusCodes.FORBIDDEN));
        }
    } catch (err) {
        return next(
            new DefaultErrorResponse('Something went wrong, could not login', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'NOT_FOUND_SECRET_KJDHSAHJSDA',
        { expiresIn: '1h' },
    );

    const responseData = {
        userId: user._id,
        email: user.email,
        token,
    };

    res.json({ data: responseData });
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
        const hashedPassword = await bcrypt.hash(password, 12);
        newUser = new User(<IUser>{
            email,
            name,
            password: hashedPassword,
            image: req.file.path,
            places: [] as unknown[],
        });
        await newUser.save();
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not create user.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email } as IAppTokenFormat,
        process.env.JWT_SECRET || 'NOT_FOUND_SECRET_KJDHSAHJSDA',
        { expiresIn: '1h' },
    );

    const responseData = {
        userId: newUser._id,
        email: newUser.email,
        token,
    };

    res.status(StatusCodes.CREATED).json({ data: responseData });
};
