import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../../components/UI/Avatar';
import Card from '../../../components/UI/Card';
import { IUser } from '../../../typescript';

interface UsersListProps {
	items: IUser[];
}
const UsersList: React.FC<UsersListProps> = (props) => {
	const userItem = (user: IUser): JSX.Element => {
		return (
			<li className='user-item' key={user.id}>
				<Card className='user-item__content'>
					<Link to={`/${user.id}/places`}>
						<div className='user-item__image'>
							<Avatar alt={user.name} image={user.image} />
						</div>
						<div className='user-item__info'>
							<h2>{user.name}</h2>
							<h3>{user.places.length} Place(s)</h3>
						</div>
					</Link>
				</Card>
			</li>
		);
	};

	if (!props.items.length)
		return (
			<div className='center'>
				<Card>
					<h2> No Users found!</h2>
				</Card>
			</div>
		);

	return <ul className='users-list'>{props.items.map((el, i) => userItem(el))}</ul>;
};

export default UsersList;
