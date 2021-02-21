import React from 'react';

import './Avatar.scss';

interface AvatarProps {
	className?: string;
	image: string;
	alt: string;
	width?: string;
	style?: React.CSSProperties;
}
const Avatar: React.FC<AvatarProps> = (props) => {
	return (
		<div className={`avatar ${props.className}`} style={props.style}>
			<img src={props.image} alt={props.alt} style={{ width: props.width, height: props.width }} />
		</div>
	);
};

export default Avatar;
