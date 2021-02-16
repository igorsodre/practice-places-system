import React, { useState } from 'react';
import Button from '../../../components/FormElements/Button';
import Card from '../../../components/UI/Card';
import Map from '../../../components/UI/Map';
import Modal from '../../../components/UI/Modal';
import { IPlaceItem } from '../../../typescript';

interface PlaceListProps {
	items: IPlaceItem[];
}

const _renderPlaceItem = (item: IPlaceItem): JSX.Element => {
	const [showMap, setShowMap] = useState(false);

	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

	const { address, title, locations, imageUrl, id, description, creator } = item;
	return (
		<React.Fragment key={id}>
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={address}
				contentClassName='place-item__modal-content'
				footerClassName='place-item__modal-actions'
				footer={<Button onClick={closeMapHandler}> CLOSE </Button>}>
				<div className='map-container'>
					<Map center={locations} zoom={16} />
				</div>
			</Modal>
			<li className='place-item'>
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
						<Button inverse onClick={openMapHandler}>
							VIEW ON MAP
						</Button>
						<Button to={`/places/${id}`}>EDIT</Button>
						<Button danger>DELETE</Button>
					</div>
				</Card>
			</li>
		</React.Fragment>
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
