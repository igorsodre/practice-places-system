export interface IUser {
    id: string;
    image?: string;
    name: string;
    placeCount?: number;
    email: string;
    password: string;
}

export interface ILocation {
    lat: number;
    lng: number;
}
