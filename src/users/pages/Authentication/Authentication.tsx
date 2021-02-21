import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import Card from '../../../components/UI/Card';
import AuthContext from '../../../data/auth-context';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';
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
	isLoginMode: boolean;
}
class Authentication extends React.Component<AuthenticationProps, AuthenticationState> {
	static contextType = AuthContext;
	context!: React.ContextType<typeof AuthContext>;
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
			isValid: false,
			isLoginMode: true
		};
	}

	switchModeHandler = () => {
		const { email, password } = this.state.inputs;
		if (!this.state.isLoginMode) {
			this.setState((oldState) => ({ isLoginMode: !oldState.isLoginMode, inputs: { email, password }, isValid: email.isValid && password.isValid }));
			return;
		}
		this.setState((oldState) => ({ isLoginMode: !oldState.isLoginMode, inputs: { email, password, name: { isValid: false, value: '' } }, isValid: false }));
	};

	getFormValidity = (excludeKey: string): boolean => {
		let isValid = true;
		for (let key in this.state.inputs) {
			if (key !== excludeKey && this.state.inputs[key]) isValid = isValid && this.state.inputs[key].isValid;
		}
		return isValid;
	};

	inputHandler = (id: string, value: string, isValid: boolean) => {
		const formValidity = this.getFormValidity(id);
		this.setState((oldState) => ({ inputs: { ...oldState.inputs, [id]: { value, isValid } }, isValid: formValidity && isValid }));
	};

	formSubmitLoginHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(this.state.inputs); // sebd to the backend
		this.context.login();
	};

	render = () => {
		return (
			<Card className='authentication'>
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={this.formSubmitLoginHandler}>
					{!this.state.isLoginMode && (
						<Input
							id='name'
							element='input'
							type='text'
							label='Your Name'
							validators={[VALIDATOR_REQUIRE()]}
							errorText='Please enter a name'
							onInput={this.inputHandler}
						/>
					)}
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
					<Button type='submit' disabled={!this.state.isValid}>
						{this.state.isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button onClick={this.switchModeHandler}>SWITCH TO {!this.state.isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
			</Card>
		);
	};
}

export default withRouter(Authentication);
