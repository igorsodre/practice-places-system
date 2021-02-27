import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import Card from '../../../components/UI/Card';
import AuthContext from '../../../data/auth-context';
import { PlacesService } from '../../../services/places.service';
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
	static contextType = AuthContext;
	context!: React.ContextType<typeof AuthContext>;
	place?: IPlaceItem;
	constructor(props: UpdatePlaceProps) {
		super(props);

		this.state = {
			inputs: {
				description: {
					value: '',
					isValid: false
				},
				title: {
					value: '',
					isValid: false
				}
			},
			isValid: false
		};
	}

	componentDidMount = async () => {
		await this.retrievePlace();
	};

	retrievePlace = async () => {
		const { placeId } = this.props.match.params;
		try {
			this.place = await PlacesService.getPlacesById(placeId);
			this.setState({
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
			});
		} catch (error) {
			console.log(error);
		}
	};

	onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { placeId } = this.props.match.params;
		const { title, description } = this.state.inputs;
		const { userId } = this.context;
		if (this.state.isValid) {
			await PlacesService.updatePlace(placeId, title.value, description.value);
			this.props.history.push(`/${userId}/places`);
		}
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
		if (!this.place)
			return (
				<div className='center'>
					<Card>
						<h2>Could not find place!</h2>
					</Card>
				</div>
			);
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
