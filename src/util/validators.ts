import { IValidator, IValidatorResponse } from '../typescript';

const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';

export const VALIDATOR_REQUIRE: IValidator = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE: IValidator = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH: IValidator = (val) => ({
	type: VALIDATOR_TYPE_MINLENGTH,
	payload: val
});
export const VALIDATOR_MAXLENGTH: IValidator = (val) => ({
	type: VALIDATOR_TYPE_MAXLENGTH,
	payload: val
});
export const VALIDATOR_MIN: IValidator = (val) => ({ type: VALIDATOR_TYPE_MIN, payload: val });
export const VALIDATOR_MAX: IValidator = (val) => ({ type: VALIDATOR_TYPE_MAX, payload: val });
export const VALIDATOR_EMAIL: IValidator = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const validate = (value: string, validators: IValidatorResponse[]): boolean => {
	let isValid = true;
	for (const validator of validators) {
		if (validator.type === VALIDATOR_TYPE_REQUIRE) {
			isValid = isValid && value.trim().length > 0;
		}
		if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
			isValid = isValid && value.trim().length >= +validator.payload!;
		}
		if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
			isValid = isValid && value.trim().length <= validator.payload!;
		}
		if (validator.type === VALIDATOR_TYPE_MIN) {
			isValid = isValid && +value >= validator.payload!;
		}
		if (validator.type === VALIDATOR_TYPE_MAX) {
			isValid = isValid && +value <= validator.payload!;
		}
		if (validator.type === VALIDATOR_TYPE_EMAIL) {
			isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
		}
	}
	return isValid;
};
