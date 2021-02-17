import React, { useReducer } from 'react';
import * as R from 'ramda';
import { IValidatorResponse } from '../../typescript';
import { validate } from '../../util/validators';
import './Input.scss';

const CHANGE_ACTION = 'CHANGE';
const TOUCH_ACTION = 'TOUCH';
interface IAction {
	type: typeof CHANGE_ACTION | typeof TOUCH_ACTION;
	payload: string;
	validators: IValidatorResponse[];
}

interface IState {
	value: string;
	isValid: boolean;
	isTouched: boolean;
}

type IReducer = (state: IState, action: IAction) => IState;

const handleChangeAction: IReducer = (state, action) => {
	const newState = R.clone(state);
	newState.value = action.payload;
	newState.isValid = validate(action.payload, action.validators);
	return newState;
};

const handleTouchAction: IReducer = (state, action) => {
	const newState = R.clone(state);
	newState.isTouched = true;
	return newState;
};

const InputReducer: IReducer = (state, action) => {
	switch (action.type) {
		case CHANGE_ACTION:
			return handleChangeAction(state, action);
		case TOUCH_ACTION:
			return handleTouchAction(state, action);
		default:
			return state;
	}
};

interface InputProps {
	className?: string;
	label?: string;
	id: string;
	type?: string;
	placeholder?: string;
	rows?: number;
	element?: 'input' | 'textarea';
	errorText?: string;
	validators: IValidatorResponse[];
}

const Input: React.FC<InputProps> = ({ id, element, label, type, placeholder, rows = 3, className, errorText, validators }) => {
	const [inputState, dispatch] = useReducer(InputReducer, { value: '', isValid: false, isTouched: false });
	const changehandler = ({ target: { value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		dispatch({ payload: value, type: CHANGE_ACTION, validators });
	};
	const toucheHandler = () => {
		dispatch({ type: TOUCH_ACTION, payload: '', validators: [] });
	};
	const el =
		element === 'input' ? (
			<input id={id} type={type} value={inputState.value} placeholder={placeholder} onChange={changehandler} onBlur={toucheHandler} />
		) : (
			<textarea id={id} value={inputState.value} rows={rows} onChange={changehandler} onBlur={toucheHandler} />
		);
	return (
		<div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
			<label htmlFor={id}>{label}</label>
			{el}
			{!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
		</div>
	);
};

export default Input;
