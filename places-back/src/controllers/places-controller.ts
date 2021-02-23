import { ILocation } from './../typescript/index.d';
import { getAdressLocation } from './../util/locations';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidV4 } from 'uuid';

import { IPlaceItem } from '../typescript';
import { DefaultErrorResponse } from '../util/DefaultErrorResponse';

let DUMMY_PLACES: IPlaceItem[] = [
    {
        title: 'Place One',
        location: { lat: 40.7484405, lng: -73.9878531 },
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
        id: 'p1',
        description: 'A cool building',
        creator: 'u1',
        address: '20 W 34th St, New York, NY 10001, United States',
    },
    {
        title: 'Place TWO',
        location: { lat: 40.7484405, lng: -73.9878531 },
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
        id: 'p2',
        description: 'A cool building',
        creator: 'u2',
        address: '20 W 34th St, New York, NY 10001, United States',
    },
];

export const getPlacesByUserId: RequestHandler = (req, res, next) => {
    const uid = req.params.uid;
    const places = DUMMY_PLACES.filter((p) => p.creator === uid);
    if (!places.length) {
        return next(new DefaultErrorResponse('Could not find a place for the provided user.', StatusCodes.NOT_FOUND));
    }

    res.json({ data: places });
};

export const getPlaceById: RequestHandler = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    if (!place) {
        return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
    }
    res.json({ data: place });
};

interface ICreatePlaceBody {
    title: string;
    description: string;
    address: string;
    creator: string;
}
export const createPlace: RequestHandler = async (req, res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }
    const { address, title, description, creator } = req.body as ICreatePlaceBody;
    let location: ILocation;
    try {
        location = await getAdressLocation(address);
    } catch (err) {
        return next(err);
    }

    const newPlace: IPlaceItem = {
        id: uuidV4(),
        address,
        creator,
        description,
        location,
        title,
    };
    DUMMY_PLACES.push(newPlace);
    res.status(StatusCodes.CREATED).json({ data: newPlace });
};

interface IUpdatePlaceBody {
    title: string;
    description: string;
}
export const updatePlace: RequestHandler = (req, res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }

    const placeId = req.params.placeId;
    const { title, description } = req.body as IUpdatePlaceBody;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    const arrIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (!place) {
        return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
    }
    const updatedPlace = { ...place, description, title };
    DUMMY_PLACES[arrIndex] = updatedPlace;
    return res.json({ data: updatedPlace });
};

export const deletePlace: RequestHandler = (req, res, next) => {
    const placeId = req.params.placeId;
    if (!DUMMY_PLACES.some((p) => p.id === placeId)) {
        return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
    }
    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
    res.json({ data: 'OK' });
};
