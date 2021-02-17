import React from 'react';
import './Input.scss';

interface InputProps {
	className?: string;
	label?: string;
	id: string;
	type?: string;
	placeholder?: string;
	rows?: number;
	element?: 'input' | 'textarea';
}
const Input: React.FC<InputProps> = ({ id, element, label, type, placeholder, rows = 3, className }) => {
	const el = element === 'input' ? <input id={id} type={type} placeholder={placeholder} /> : <textarea id={id} rows={rows} />;
	return (
		<div className={`form-control`}>
			<label htmlFor={id}>{label}</label>
			{el}
		</div>
	);
};

export default Input;
