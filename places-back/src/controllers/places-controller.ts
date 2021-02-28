import { RequestHandler } from 'express';
import fs from 'fs';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { IPlaceItem, Place } from '../models/place';
import { IUser, User } from '../models/user';
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
    const { path } = req.file;
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
        imageUrl: path,
    });

    let user: IUser | null;
    try {
        user = await User.findById(creator);
        if (!user) {
            return new DefaultErrorResponse('Something went worong, could not find user', StatusCodes.NOT_FOUND);
        }
    } catch {
        return new DefaultErrorResponse(
            'Something went worong, could not find user',
            StatusCodes.INTERNAL_SERVER_ERROR,
        );
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({ session: sess });
        user.places?.push(newPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log('\n\n\n');
        console.log(err);
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
        if (!updatedPlace) {
            return next(new DefaultErrorResponse('Could not find a place for the provided id.', StatusCodes.NOT_FOUND));
        }
    } catch {
        return next(
            new DefaultErrorResponse('Something went wrong, could not find place.', StatusCodes.INTERNAL_SERVER_ERROR),
        );
    }

    if (updatedPlace.creator.toString() !== req.userData?.userId) {
        return next(
            new DefaultErrorResponse('User not allowed to modify/remove this resource.', StatusCodes.UNAUTHORIZED),
        );
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
    let place: IPlaceItem | null;
    try {
        place = await Place.findById(placeId).populate('creator');
        if (!place) {
            return next(new DefaultErrorResponse('could not find place.', StatusCodes.NOT_FOUND));
        }
    } catch (err) {
        return next(
            new DefaultErrorResponse(
                'Something went wrong, could not delete place.',
                StatusCodes.INTERNAL_SERVER_ERROR,
            ),
        );
    }

    if ((place.creator as any).id !== req.userData?.userId) {
        return next(
            new DefaultErrorResponse('User not allowed to modify/remove this resource.', StatusCodes.UNAUTHORIZED),
        );
    }

    const imagePath = String(place.imageUrl);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        (place.creator as any).places.pull(place);
        (place.creator as any).save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        return next(
            new DefaultErrorResponse(
                'Something went wrong, could not delete place.',
                StatusCodes.INTERNAL_SERVER_ERROR,
            ),
        );
    }

    fs.unlink(imagePath, (err) => {
        err && console.log(err);
    });

    res.json({ data: 'OK' });
};
