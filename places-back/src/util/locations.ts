import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ILocation } from './../typescript/index.d';
import { DefaultErrorResponse } from './default-error-response';

export const getAdressLocation = async (addres: string): Promise<ILocation> => {
    const API_KEY = process.env.API_KEY;
    const encodedAddress = encodeURIComponent(addres);
    const google_endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;

    const { data } = await axios.get(google_endpoint);

    if (!data || data.status !== 'OK') {
        throw new DefaultErrorResponse(
            'Could not find location for the specified address',
            StatusCodes.UNPROCESSABLE_ENTITY,
        );
    }
    const coords = data.results[0].geometry.location;
    return {
        lat: coords.lat,
        lng: coords.lng,
    };
};
