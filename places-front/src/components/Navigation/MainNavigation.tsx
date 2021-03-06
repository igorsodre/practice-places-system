import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackDrop from '../UI/BackDrop';
import MainHeader from './MainHeader';
import './MainNavigation.scss';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';

interface MainNavigationProps {}
const MainNavigation: React.FC<MainNavigationProps> = (props) => {
	const [drawerIsOpened, setDrawerIsOpened] = useState(false);

	const openDrawerHandler = () => {
		setDrawerIsOpened(true);
	};

	const closeDrawerHandler = () => {
		setDrawerIsOpened(false);
	};
	return (
		<React.Fragment>
			{drawerIsOpened && <BackDrop onClick={closeDrawerHandler} />}

			<SideDrawer onCLick={closeDrawerHandler} show={drawerIsOpened}>
				<nav className='main-navigation_drawer-nav'>
					<NavLinks />
				</nav>
			</SideDrawer>

			<MainHeader>
				<button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
					<span />
					<span />
					<span />
				</button>
				<h1 className='main-navigation__title'>
					<Link to='/'>Your Places</Link>
				</h1>
				<nav className='main-navigation__header-nav'>
					<NavLinks />
				</nav>
			</MainHeader>
		</React.Fragment>
	);
};

export default MainNavigation;
