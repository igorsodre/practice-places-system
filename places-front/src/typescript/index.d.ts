export interface IUser {
	id: string;
	image: string;
	name: string;
	places: IPlaceItem[];
}

export interface IPlaceItem {
	id?: string;
	imageUrl: string;
	title: string;
	description: string;
	address: string;
	creator: string;
	location: { lat: number; lng: number };
}

export interface IValidatorResponse {
	type: string;
	payload?: string | number;
}
export type IValidator = (val?: string | number) => IValidatorResponse;
