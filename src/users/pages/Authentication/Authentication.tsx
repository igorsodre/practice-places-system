import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import Card from '../../../components/UI/Card';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../../util/validators';
import './Authentication.scss';

interface RouteProps {}
interface AuthenticationProps extends RouteComponentProps<RouteProps, {}, {}> {}
interface AuthenticationState {
	inputs: {
		[key: string]: {
			value: string;
			isValid: boolean;
		};
	};
	isValid: boolean;
}
class Authentication extends React.Component<AuthenticationProps, AuthenticationState> {
	constructor(props: AuthenticationProps) {
		super(props);
		this.state = {
			inputs: {
				email: {
					value: '',
					isValid: false
				},
				password: {
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
			<Card className='authentication'>
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={this.formSubmithandler}>
					<Input
						element='input'
						id='email'
						type='email'
						label='E-Mail'
						validators={[VALIDATOR_EMAIL()]}
						errorText='Please enter a valid email.'
						onInput={this.inputHandler}
					/>
					<Input
						element='input'
						id='password'
						type='password'
						label='Password'
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText='Please enter a valid password, at least 5 characters.'
						onInput={this.inputHandler}
					/>
				</form>
				<Button type='submit' disabled={!this.state.isValid}>
					LOGIN
				</Button>
			</Card>
		);
	};
}

export default withRouter(Authentication);
