import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlacesService } from '../../../services/places.service';
import { IPlaceItem } from '../../../typescript';
import PlaceList from './PlaceList';
import './UserPlaces.scss';

interface UserPlaceRouteParams {
	userId: string;
}
interface UserPlacesProps {}
const UserPlaces: React.FC<UserPlacesProps> = (props) => {
	const { userId } = useParams<UserPlaceRouteParams>();
	const [loadedPlaces, setLoadedPlaces] = useState<IPlaceItem[]>([]);
	useEffect(() => {
		PlacesService.getPlacesByUser(userId).then((res) => {
			setLoadedPlaces(res);
		});
	}, [userId]);
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
