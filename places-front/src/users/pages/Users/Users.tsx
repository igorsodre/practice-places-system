import React, { useEffect, useState } from 'react';
import ErrorModal from '../../../components/UI/ErrorModal';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { UsersService } from '../../../services/users.service';
import { IUser } from '../../../typescript';
import UsersList from './UsersList';
import './Users.scss';

interface UsersProps {}
const Users: React.FC<UsersProps> = (props) => {
	const [users, setUsers] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const result = await UsersService.getUsers();
				setUsers(result);
			} catch (err) {
				console.log('\n something went wrong');
				console.log(err);
				setError(err.message);
			}
			setIsLoading(false);
		})();
	}, []);

	const clearModalHandler = () => {
		setError('');
	};

	return (
		<React.Fragment>
			<ErrorModal onClear={clearModalHandler} error={error} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner asOverlay={false} />
				</div>
			)}
			{!isLoading && <UsersList items={users} />}
		</React.Fragment>
	);
};

export default Users;
