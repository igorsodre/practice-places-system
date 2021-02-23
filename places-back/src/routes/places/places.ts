import { Router } from 'express';
import { check } from 'express-validator';

import {
    createPlace,
    deletePlace,
    getPlaceById,
    getPlacesByUserId,
    updatePlace,
} from '../../controllers/places-controller';

const router = Router();

router.get('/user/:uid', getPlacesByUserId);

router.get('/:placeId', getPlaceById);

router.post(
    '/',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').notEmpty()],
    createPlace,
);

router.patch('/:placeId', [check('title').notEmpty(), check('description').isLength({ min: 5 })], updatePlace);

router.delete('/:placeId', deletePlace);

export default router;
