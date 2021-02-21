import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.scss';

interface SideDrawerProps {
	show: boolean;
	onCLick: () => void;
}
const SideDrawer: React.FC<SideDrawerProps> = (props) => {
	const drawer = (
		<CSSTransition in={props.show} timeout={200} classNames='slide-in-left' mountOnEnter unmountOnExit>
			<aside onClick={props.onCLick} className='side-drawer'>
				{props.children}
			</aside>
		</CSSTransition>
	);
	return ReactDOM.createPortal(drawer, document.getElementById('drawer-hook')!);
};

export default SideDrawer;
