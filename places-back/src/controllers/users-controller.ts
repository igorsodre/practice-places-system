import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express';
import { IUser } from '../typescript';
import { v4 as uuidV4 } from 'uuid';
import { DefaultErrorResponse } from '../util/DefaultErrorResponse';
import { validationResult } from 'express-validator';
const DUMMY_USERS: IUser[] = [
    {
        id: 'u1',
        name: 'Name1',
        email: 'email@email.com',
        password: '12345',
    },
];

export const getUsers: RequestHandler = (req, res) => {
    res.json({ data: DUMMY_USERS });
};

interface ILoginBody {
    email: string;
    password: string;
}
export const login: RequestHandler = (req, res, next) => {
    const { email, password } = req.body as ILoginBody;
    const user = DUMMY_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
        return next(new DefaultErrorResponse('Invalid user or password', StatusCodes.UNAUTHORIZED));
    }
    res.json({ data: 'OK' });
};

interface ISignupBody {
    name: string;
    email: string;
    password: string;
}
export const signup: RequestHandler = (req, res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }
    const { password, name, email } = req.body as ISignupBody;
    const alreadyExists = DUMMY_USERS.some((u) => u.email === email);
    if (alreadyExists) {
        return next(new DefaultErrorResponse('User already exists', StatusCodes.UNPROCESSABLE_ENTITY));
    }
    const newUser: IUser = { id: uuidV4(), email, name, password };
    DUMMY_USERS.push(newUser);
    res.json(newUser);
};
