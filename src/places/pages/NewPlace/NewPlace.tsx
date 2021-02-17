import React from 'react';
import Input from '../../../components/FormElements/Input';
import './NewPlace.scss';

interface NewPlaceProps {}
const NewPlace: React.FC<NewPlaceProps> = (props) => {
	return (
		<form className='place-form'>
			<Input element='input' id='asds' />
		</form>
	);
};

export default NewPlace;
