import React, { FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';
import './NewPlace.scss';

interface RouteProps {}
interface NewPlaceProps extends RouteComponentProps<RouteProps, {}, {}> {}
interface NewPlaceState {
	inputs: {
		[key: string]: {
			value: string;
			isValid: boolean;
		};
	};
	isValid: boolean;
}

class NewPlace extends React.Component<NewPlaceProps, NewPlaceState> {
	constructor(props: NewPlaceProps) {
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

	getFormValidity = (excludeKey: string): boolean => {
		let isValid = true;
		for (let key in this.state.inputs) {
			if (key !== excludeKey) isValid = isValid && this.state.inputs[key].isValid;
		}
		return isValid;
	};

	inputHandler = (id: string, value: string, isValid: boolean) => {
		const formValidity = this.getFormValidity(id);
		this.setState((oldState) => ({ inputs: { ...oldState.inputs, [id]: { value, isValid } }, isValid: formValidity && isValid }));
	};

	formSubmithandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(this.state.inputs); // sebd to the backend
	};

	render = () => {
		return (
			<form className='place-form' onSubmit={this.formSubmithandler}>
				<Input
					element='input'
					id='title'
					type='text'
					label='Title'
					errorText='Please enter a valid title.'
					validators={[VALIDATOR_REQUIRE()]}
					onInput={this.inputHandler}
				/>
				<Input
					element='textarea'
					id='description'
					label='Description'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid description (at least 5 characters).'
					onInput={this.inputHandler}
				/>
				<Button type='submit' disabled={!this.state.isValid}>
					ADD PLACE
				</Button>
			</form>
		);
	};
}

export default withRouter(NewPlace);
