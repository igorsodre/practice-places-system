import React from 'react';
import Button from '../FormElements/Button';
import './Modal.scss';
import Modal from './Modal';

interface ErrorModalProps {
	onClear: () => void;
	error?: string;
}
const ErrorModal: React.FC<ErrorModalProps> = (props) => {
	return (
		<Modal onCancel={props.onClear} header='An Error Occurred!' show={!!props.error} footer={<Button onClick={props.onClear}>Okay</Button>}>
			<p style={{ padding: '0 1rem' }}>{props.error}</p>
		</Modal>
	);
};

export default ErrorModal;
