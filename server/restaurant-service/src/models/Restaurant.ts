import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
    name: string;
    address: string;
    location: {
        longitude: number;
        latitude: number;
    };
    email: string;
    ownerId: mongoose.Types.ObjectId;
    imageUrls: string[]; // Now supports multiple images from Supabase
    openTime: string;
    closeTime: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const restaurantSchema: Schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        location: {
            longitude: { type: Number, required: true },
            latitude: { type: Number, required: true },
        },
        email: { type: String, required: true },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrls: {
            type: [String],
            default: [],
        },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
