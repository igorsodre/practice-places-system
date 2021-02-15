import React from 'react';
import ReactDOM from 'react-dom';
import './BackDrop.scss';

interface BackDropProps {
	onClick: () => void;
}
const BackDrop: React.FC<BackDropProps> = (props) => {
	return ReactDOM.createPortal(<div className='backdrop' onClick={props.onClick}></div>, document.getElementById('backdrop-hook')!);
};

export default BackDrop;
