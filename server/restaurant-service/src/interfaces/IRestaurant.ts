import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IRestaurant extends Document {
    name: string;
    address: string;
    location: {
        longitude: number;
        latitude: number;
    };
    email: string;
    ownerId: ObjectId;
    imageUrls: string[];  // Array of Supabase image URLs
    openTime: string;     // Format: "HH:MM" (e.g., "08:00")
    closeTime: string;    // Format: "HH:MM" (e.g., "22:00")
    createdAt?: Date;
    updatedAt?: Date;
}

// Extended interface with `isOpen` for frontend use
export interface IRestaurantWithStatus extends IRestaurant {
    isOpen: boolean;  // Computed field (based on openTime/closeTime)
}