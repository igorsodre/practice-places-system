export interface IUser {
	id: string;
	image: string;
	name: string;
	placeCount: number;
}

export interface IPlaceItem {
	id: string;
	imageUrl: string;
	title: string;
	description: string;
	address: string;
	creator: string;
	locations: { lat: number; long: number };
}
