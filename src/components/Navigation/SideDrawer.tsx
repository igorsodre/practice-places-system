import React from 'react';
import ReactDOM from 'react-dom';
import './SideDrawer.scss';

interface SideDrawerProps {}
const SideDrawer: React.FC<SideDrawerProps> = (props) => {
	const drawer = <aside className='side-drawer'>{props.children}</aside>;
	return ReactDOM.createPortal(drawer, document.getElementById('drawer-hook')!);
};

export default SideDrawer;
