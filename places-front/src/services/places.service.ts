import http from '../util/http';
import { BASE_URL } from './../data/constants';
import { IPlaceItem } from './../typescript/index.d';
import { DefaultResponse } from './../util/http';

export class PlacesService {
  static async getPlacesByUser(userId: string) {
    const endpoint = BASE_URL + '/api/places/user/' + userId;
    return http.get<DefaultResponse<IPlaceItem[]>>(endpoint).then((res) => res.data.data);
  }

  static async getPlacesById(placeId: string) {
    const endpoint = BASE_URL + '/api/places/' + placeId;
    return http.get<DefaultResponse<IPlaceItem>>(endpoint).then((res) => res.data.data);
  }

  static async createPlace(title: string, address: string, creator: string, description: string, image: File) {
    const endpoint = BASE_URL + '/api/places/';
    const form = new FormData();
    form.append('title', title);
    form.append('address', address);
    form.append('creator', creator);
    form.append('description', description);
    form.append('image', image);

    return http
      .post<DefaultResponse<IPlaceItem>>(endpoint, form, {
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
      })
      .then((res) => res.data.data);
  }

  static async updatePlace(placeId: string, title: string, description: string) {
    const endpoint = BASE_URL + '/api/places/' + placeId;
    const body = {
      title,
      description,
    };
    return http.patch<DefaultResponse<IPlaceItem>>(endpoint, body).then((res) => res.data.data);
  }

  static async removePlace(placeId: string) {
    const endpoint = BASE_URL + '/api/places/' + placeId;
    return http.delete<DefaultResponse<string>>(endpoint).then((res) => res.data.data);
  }
}
