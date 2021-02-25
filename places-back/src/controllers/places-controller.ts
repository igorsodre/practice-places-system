import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { IPlaceItem, Place } from '../models/place';
import { DefaultErrorResponse } from '../util/default-error-response';
import { ILocation } from './../typescript/index.d';
import { getAdressLocation } from './../util/locations';

export const getPlacesByUserId: RequestHandler = async (req, res, next) => {
    const uid = req.params.uid;
    let places: IPlaceItem[];
    try {
        places = await Place.find({ creator: uid });
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not find places.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }
    if (!places.length) {
        return next(new DefaultErrorResponse('Could not find a place for the provided user.', StatusCodes.NOT_FOUND));
    }

    res.json({ data: places.map((p) => p.toObject({ getters: true })) });
};

export const getPlaceById: RequestHandler = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place: IPlaceItem | null;
    try {
        place = await Place.findById(placeId);
    } catch {
        return next(
            new DefaultErrorResponse(
                'Something went wrong, could not find a place.',
                StatusCodes.INTERNAL_SERVER_ERROR,
            ),
        );
    }
    if (!place) {
        return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
    }
    res.json({ data: place.toObject({ getters: true }) });
};

interface ICreatePlaceBody {
    title: string;
    description: string;
    address: string;
    creator: string;
}
export const createPlace: RequestHandler = async (req, res, next) => {
    // validate inputs
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }

    // get coordinates for address
    const { address, title, description, creator } = req.body as ICreatePlaceBody;
    let location: ILocation;
    try {
        location = await getAdressLocation(address);
    } catch (err) {
        return next(err);
    }

    // persist
    const newPlace = new Place(<IPlaceItem>{
        title,
        description,
        address,
        location,
        creator,
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
    });

    try {
        await newPlace.save();
    } catch {
        return next(
            new DefaultErrorResponse('Creating place failed, please try again', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }
    res.status(StatusCodes.CREATED).json({ data: newPlace });
};

interface IUpdatePlaceBody {
    title: string;
    description: string;
}
export const updatePlace: RequestHandler = async (req, res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        return next(
            new DefaultErrorResponse('Invalid inputs passed, please ceck your data', StatusCodes.UNPROCESSABLE_ENTITY),
        );
    }

    const placeId = req.params.placeId;
    const { title, description } = req.body as IUpdatePlaceBody;
    let updatedPlace: IPlaceItem | null;
    try {
        updatedPlace = await Place.findById(placeId);
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not find place.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }
    if (!updatedPlace) {
        return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
    }
    try {
        updatedPlace.title = title;
        updatedPlace.description = description;
        await updatedPlace.save();
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not find place.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    return res.json({ data: updatedPlace.toObject({ getters: true }) });
};

export const deletePlace: RequestHandler = async (req, res, next) => {
    const placeId = req.params.placeId;
    try {
        await Place.deleteOne({ id: placeId });
    } catch (err) {
        return next(
            new DefaultErrorResponse(
                'Something went wrong, could not delete place.',
                StatusCodes.INTERNAL_SERVER_ERROR,
            ),
        );
    }

    res.json({ data: 'OK' });
};
