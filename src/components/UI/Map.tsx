import React, { useEffect, useRef } from 'react';
import './Map.scss';

interface MapProps {
	className?: string;
	center: { lat: number; lng: number };
	zoom: number;
	style?: React.CSSProperties;
}
const Map: React.FC<MapProps> = ({ className, center, zoom, style }) => {
	const mapRef = useRef<HTMLDivElement>(null as any);

	useEffect(() => {
		const map = new google.maps.Map(mapRef.current!, {
			center,
			zoom
		});
		new google.maps.Marker({ position: center, map: map });
	}, [center, zoom]);

	return <div ref={mapRef} className={`map ${className}`} style={style}></div>;
};

export default Map;
