import React from 'react';
import './MainHeader.scss';

interface MainHeaderProps {}
const MainHeader: React.FC<MainHeaderProps> = (props) => {
	return <header className='main-header'>{props.children}</header>;
};

export default MainHeader;
