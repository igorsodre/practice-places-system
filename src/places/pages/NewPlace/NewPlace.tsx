import React from 'react';
import Input from '../../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../../util/validators';
import './NewPlace.scss';

interface NewPlaceProps {}
const NewPlace: React.FC<NewPlaceProps> = (props) => {
	return (
		<form className='place-form'>
			<Input element='input' id='asds' type='text' label='Title' errorText='Please enter a valid title.' validators={[VALIDATOR_REQUIRE()]} />
		</form>
	);
};

export default NewPlace;
