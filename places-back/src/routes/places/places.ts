import { Router } from 'express';
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

router.post('/', createPlace);

router.patch('/:placeId', updatePlace);

router.delete('/:placeId', deletePlace);

export default router;
