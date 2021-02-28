import http from '../util/http';
import { BASE_URL } from '../data/constants';
import { IUser } from '../typescript';
import { DefaultResponse } from './../util/http';

export class AuthService {
	static async login(email: string, password: string) {
		const endpoint = BASE_URL + '/api/users/login';
		const body = {
			email,
			password
		};
		return http.post<DefaultResponse<IUser>>(endpoint, body).then((res) => res.data.data);
	}

	static async signup(email: string, password: string, name: string, image: File) {
		const endpoint = BASE_URL + '/api/users/signup';

		const form = new FormData();
		form.append('email', email);
		form.append('password', password);
		form.append('name', name);
		form.append('image', image);
		return http
			.post<DefaultResponse<IUser>>(endpoint, form, {
				headers: {
					'Content-Type': 'multipart/form-data;'
				}
			})
			.then((res) => res.data.data);
	}
}
