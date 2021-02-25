import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    places?: unknown[];
    image?: string;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});
userSchema.plugin(uniqueValidator);

export const User = mongoose.model<IUser>('User', userSchema);
