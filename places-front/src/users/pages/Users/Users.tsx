import React from 'react';
import { IUser } from '../../../typescript';
import UsersList from './UsersList';
import './Users.scss';

interface UsersProps {}
const Users: React.FC<UsersProps> = (props) => {
	const USERS: IUser[] = [
		{
			id: 'u1',
			image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80',
			name: 'Nome 1',
			placeCount: 3
		}
	];
	return (
		<div>
			<UsersList items={USERS} />
		</div>
	);
};

export default Users;
