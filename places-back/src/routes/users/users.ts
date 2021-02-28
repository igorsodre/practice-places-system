import { fileUpload } from './../../util/file-upload-middleware';
import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, login, signup } from '../../controllers/users-controller';

const router = Router();

router.get('/', getUsers);

router.post(
    '/signup',
    fileUpload.single('image'),
    [check('name').notEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 6 })],
    signup,
);

router.post('/login', login);

export default router;
