import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import BackDrop from './BackDrop';
import './Modal.scss';

interface ModalOverlayProps {
	header?: JSX.Element | string;
	footer?: JSX.Element | string;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
	style?: React.CSSProperties;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
const ModalOverlady: React.FC<ModalOverlayProps> = (props) => {
	const { style, onSubmit, headerClassName, header, footerClassName, footer, contentClassName, className, children } = props;
	const content = (
		<div className={`modal ${className}`} style={style}>
			<header className={`modal__header ${headerClassName}`}>
				<h2>{header}</h2>
			</header>
			<form onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}>
				<div className={`moda__content ${contentClassName}`}>{children}</div>
				<footer className={`modal__footer ${footerClassName}`}>{footer}</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById('modal-hook')!);
};

interface ModalProps extends ModalOverlayProps {
	show: boolean;
	onCancel: () => void;
}
const Modal: React.FC<ModalProps> = (props) => {
	const { show, onCancel } = props;
	return (
		<React.Fragment>
			{show && <BackDrop onClick={onCancel} />}
			<CSSTransition in={show} mountOnEnter unmountOnExit timeout={200} classNames='modal'>
				<ModalOverlady {...props} />
			</CSSTransition>
		</React.Fragment>
	);
};

export default Modal;
