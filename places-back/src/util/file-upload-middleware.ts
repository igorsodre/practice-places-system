import { RequestHandler } from 'express';
import { v1 as uuidV1 } from 'uuid';
import multer from 'multer';

const MIME_TYPE_MAP: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};

export const fileUpload = multer({
    limits: { fileSize: 5000000 },
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (_req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidV1() + '.' + ext);
        },
    }),
    fileFilter: (_req, file, cb) => {
        const isValid = Boolean(MIME_TYPE_MAP[file.mimetype]);
        isValid ? cb(null, true) : cb(new Error('invalid mime-type!'));
    },
});
