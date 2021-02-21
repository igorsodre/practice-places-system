import React from 'react';

import './Card.scss';
interface CardProps {
	className?: string;
	style?: React.CSSProperties;
}
const Card: React.FC<CardProps> = (props) => {
	return (
		<div className={`card ${props.className}`} style={props.style}>
			{props.children}
		</div>
	);
};

export default Card;
