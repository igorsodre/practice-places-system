import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Button from '../../../components/FormElements/Button';
import Input from '../../../components/FormElements/Input';
import Card from '../../../components/UI/Card';
import ErrorModal from '../../../components/UI/ErrorModal';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import AuthContext from '../../../data/auth-context';
import { AuthService } from '../../../services/auth.service';
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
	isLoading: boolean;
	error?: string;
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
			isLoginMode: true,
			isLoading: false
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

	performLogin = async () => {
		this.setState({ isLoading: true });
		try {
			const { email, password } = this.state.inputs;
			const result = await AuthService.login(email.value, password.value);
			this.context.login(result.id);
		} catch (err) {
			this.setState({ error: err.message || 'something went wrong, please try again', isLoading: false });
		}
		this.setState({ isLoading: true });
	};

	performSignup = async () => {
		this.setState({ isLoading: true });
		try {
			const { email, password, name } = this.state.inputs;
			const result = await AuthService.signup(email.value, password.value, name.value);
			this.context.login(result.id);
		} catch (err) {
			this.setState({ error: err.message || 'something went wrong, please try again', isLoading: false });
		}
		this.setState({ isLoading: true });
	};

	formSubmitLoginHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.setState({ isLoading: true });
		if (this.state.isLoginMode) {
			return this.performLogin();
		} else {
			return this.performSignup();
		}
	};

	clearModalHandler = () => {
		this.setState({ error: '' });
	};

	render = () => {
		return (
			<React.Fragment>
				<ErrorModal error={this.state.error} onClear={this.clearModalHandler} />
				<Card className='authentication'>
					{this.state.isLoading && <LoadingSpinner asOverlay />}
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
			</React.Fragment>
		);
	};
}

export default withRouter(Authentication);
