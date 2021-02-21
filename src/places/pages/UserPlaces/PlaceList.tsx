import React, { useContext, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import Card from '../../../components/UI/Card';
import Map from '../../../components/UI/Map';
import Modal from '../../../components/UI/Modal';
import AuthContext, { IAuthContext } from '../../../data/auth-context';
import { IPlaceItem } from '../../../typescript';

interface PlaceListProps {
	items: IPlaceItem[];
}

const _renderPlaceItem = (item: IPlaceItem): JSX.Element => {
	const ctx = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

	const openDeleteModalHandler = () => setShowDeleteModal(true);
	const closeDeleteModalHandler = () => setShowDeleteModal(false);
	const confirmDeleteHandler = () => {
		setShowDeleteModal(false);
		console.log('deleted the place');
	};

	const { address, title, locations, imageUrl, id, description } = item;
	return (
		<React.Fragment key={id}>
			<Modal
				show={showMap}
				onCancel={closeDeleteModalHandler}
				header={address}
				contentClassName='place-item__modal-content'
				footerClassName='place-item__modal-actions'
				footer={<Button onClick={closeMapHandler}> CLOSE </Button>}>
				<div className='map-container'>
					<Map center={locations} zoom={16} />
				</div>
			</Modal>
			<Modal
				show={showDeleteModal}
				onCancel={closeDeleteModalHandler}
				header='Are you sure?'
				footerClassName='place-item__modal-actions'
				footer={
					<React.Fragment>
						<Button inverse onClick={closeDeleteModalHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}>
				<p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter</p>
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
						{ctx.isLoggedIn && <Button to={`/places/${id}`}>EDIT</Button>}
						{ctx.isLoggedIn && (
							<Button danger onClick={openDeleteModalHandler}>
								DELETE
							</Button>
						)}
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
					<h2>No places found! Maybe create one?</h2>
					<Button to='/places/new'>Share Place</Button>
				</Card>
			</div>
		);

	return <ul className='place-list'>{items.map((el) => _renderPlaceItem(el))}</ul>;
};

export default PlaceList;
