import React from 'react';
import { useParams } from 'react-router-dom';
import { IPlaceItem } from '../../../typescript';
import PlaceList from './PlaceList';
import './UserPlaces.scss';

const DUMMY_PLACES: IPlaceItem[] = [
	{
		title: 'Place One',
		location: { lat: 40.7484405, lng: -73.9878531 },
		imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		id: 'p1',
		description: 'A cool building',
		creator: 'u1',
		address: '20 W 34th St, New York, NY 10001, United States'
	},
	{
		title: 'Place One',
		location: { lat: 40.7484405, lng: -73.9878531 },
		imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		id: 'p2',
		description: 'A cool building',
		creator: 'u2',
		address: '20 W 34th St, New York, NY 10001, United States'
	}
];

interface UserPlaceRouteParams {
	userId: string;
}
interface UserPlacesProps {}
const UserPlaces: React.FC<UserPlacesProps> = (props) => {
	const { userId } = useParams<UserPlaceRouteParams>();
	const loadedPlaces = DUMMY_PLACES.filter((e) => e.creator === userId);
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
