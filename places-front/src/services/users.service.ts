import http from '../util/http';
import { BASE_URL } from '../data/constants';
import { IUser } from '../typescript';
import { DefaultResponse } from './../util/http';

export class UsersService {
	static async getUsers() {
		const endpoint = BASE_URL + '/api/users';
		return await http.get<DefaultResponse<IUser[]>>(endpoint).then((res) => res.data.data);
	}
}
