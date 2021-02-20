import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import { IPlaceItem } from '../../../typescript';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';

import '../NewPlace/NewPlace.scss';

interface RouteProps {
	placeId: string;
}
interface UpdatePlaceProps extends RouteComponentProps<RouteProps, {}, {}> {}
interface UpdatePlaceState {
	inputs: {
		[key: string]: {
			value: string;
			isValid: boolean;
		};
	};
	isValid: boolean;
}
class UpdatePlace extends React.Component<UpdatePlaceProps, UpdatePlaceState> {
	place?: IPlaceItem;
	constructor(props: UpdatePlaceProps) {
		super(props);
		const {
			match: {
				params: { placeId }
			}
		} = this.props;
		this.place = DUMMY_PLACES.find((p) => p.id === placeId);

		this.state = {
			inputs: {
				description: {
					value: this.place?.description || '',
					isValid: true
				},
				title: {
					value: this.place?.title || '',
					isValid: true
				}
			},
			isValid: true
		};
	}

	onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(this.state);
	};

	getFormValidity = (excludeKey: string): boolean => {
		let isValid = true;
		for (let key in this.state.inputs) {
			if (key !== excludeKey) isValid = isValid && this.state.inputs[key].isValid;
		}
		return isValid;
	};

	onInputHandle = (id: string, value: string, isValid: boolean) => {
		const formValidity = this.getFormValidity(id);
		this.setState((oldState) => ({ inputs: { ...oldState.inputs, [id]: { value, isValid } }, isValid: formValidity && isValid }));
	};

	render = () => {
		if (!this.place) return <div className='center'>Could not find place!</div>;
		return (
			<form className='place-form' onSubmit={this.onSubmitHandler}>
				<Input
					id='title'
					type='text'
					element='input'
					label='Title'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={this.onInputHandle}
					initialValue={this.state.inputs['title'].value}
					initialValidity
				/>
				<Input
					id='description'
					element='textarea'
					label='Description'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid description (min. 5 characters).'
					onInput={this.onInputHandle}
					initialValue={this.state.inputs['description'].value}
					initialValidity
				/>

				<Button type='submit' disabled={!this.state.isValid}>
					UPDATE PLACE
				</Button>
			</form>
		);
	};
}

export default withRouter(UpdatePlace);

const DUMMY_PLACES: IPlaceItem[] = [
	{
		title: 'Place One',
		locations: { lat: 40.7484405, lng: -73.9878531 },
		imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		id: 'p1',
		description: 'A cool building',
		creator: 'u1',
		address: '20 W 34th St, New York, NY 10001, United States'
	},
	{
		title: 'Place One',
		locations: { lat: 40.7484405, lng: -73.9878531 },
		imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		id: 'p2',
		description: 'A cool building',
		creator: 'u2',
		address: '20 W 34th St, New York, NY 10001, United States'
	}
];
