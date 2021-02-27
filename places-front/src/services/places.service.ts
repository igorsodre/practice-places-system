import http from '../util/http';
import { BASE_URL } from './../data/constants';
import { IPlaceItem } from './../typescript/index.d';
import { DefaultResponse } from './../util/http';

export class PlacesService {
	static async getPlacesByUser(userId: string) {
		const endpoint = BASE_URL + '/api/places/user/' + userId;
		return http.get<DefaultResponse<IPlaceItem[]>>(endpoint);
	}

	static async getPlacesById(placeId: string) {
		const endpoint = BASE_URL + '/api/places/' + placeId;
		return http.get<DefaultResponse<IPlaceItem[]>>(endpoint);
	}

	static async createPlace(title: string, address: string, creator: string, description: string) {
		const endpoint = BASE_URL + '/api/places/';
		const body = {
			title,
			address,
			creator,
			description
		};
		return http.post<DefaultResponse<IPlaceItem>>(endpoint, body);
	}
}
