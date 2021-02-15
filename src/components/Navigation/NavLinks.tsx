import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.scss';

interface NavLinksProps {}
const NavLinks: React.FC<NavLinksProps> = (props) => {
	return (
		<ul className='nav-links'>
			<li>
				<NavLink to='/' exact>
					ALL USERS
				</NavLink>
			</li>
			<li>
				<NavLink to='/u1/places' exact>
					MY PLACES
				</NavLink>
			</li>
			<li>
				<NavLink to='/places/new' exact>
					NEW PLACE
				</NavLink>
			</li>
			<li>
				<NavLink to='/auth' exact>
					AUTHENTICATE
				</NavLink>
			</li>
		</ul>
	);
};

export default NavLinks;
