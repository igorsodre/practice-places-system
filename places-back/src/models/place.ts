import mongoose from 'mongoose';
export interface IPlaceItem extends mongoose.Document {
    id?: string;
    imageUrl?: string;
    title: string;
    description: string;
    address: string;
    creator: string;
    location: { lat: number; lng: number };
}
const placeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    address: { type: String, required: true },
    location: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
    creator: { type: String, required: true },
});

export const Place = mongoose.model<IPlaceItem>('Place', placeSchema);
