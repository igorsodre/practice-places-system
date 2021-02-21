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
	locations: { lat: number; lng: number };
}

export interface IValidatorResponse {
	type: string;
	payload?: string | number;
}
export type IValidator = (val?: string | number) => IValidatorResponse;
