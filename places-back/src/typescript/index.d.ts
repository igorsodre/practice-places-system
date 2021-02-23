export interface IUser {
    id: string;
    image?: string;
    name: string;
    placeCount?: number;
    email: string;
    password: string;
}

export interface IPlaceItem {
    id?: string;
    imageUrl?: string;
    title: string;
    description: string;
    address: string;
    creator: string;
    location: { lat: number; lng: number };
}

export interface ILocation {
    lat: number;
    lng: number;
}
