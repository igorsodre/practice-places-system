import React from 'react';
import Card from '../../../components/UI/Card';
import { IPlaceItem } from '../../../typescript';

interface PlaceListProps {
	items: IPlaceItem[];
}

const _renderPlaceItem = (item: IPlaceItem): JSX.Element => {
	const { address, title, locations, imageUrl, id, description, creator } = item;
	return (
		<li key={id} className='place-item'>
			<Card className='place-item__content'>
				<div className='place-item__image'>
					<img src={imageUrl} alt={description} />
				</div>
				<div className='place-item__info'>
					<h2>{title}</h2>
					<h3>{address}</h3>
					<p>{description}</p>
				</div>
				<div className='place-item__actions'>
					<button>VIEW ON MAP</button>
					<button>EDIT</button>
					<button>DELETE</button>
				</div>
			</Card>
		</li>
	);
};

const PlaceList: React.FC<PlaceListProps> = ({ items }) => {
	if (!items.length)
		return (
			<div className='place-list center'>
				<Card>
					<h2>No places found!</h2>
					<button>Share Place</button>
				</Card>
			</div>
		);

	return <ul className='place-list'>{items.map((el) => _renderPlaceItem(el))}</ul>;
};

export default PlaceList;
