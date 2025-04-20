import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    isAvailable: boolean;
    category?: string;
    imageUrls: string[];
}

const menuItemSchema = new Schema < IMenuItem > ({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    category: {
        type: String
    },
    imageUrls: {
        type: [String],
        default: []
    },
}, { timestamps: true });

export default mongoose.model < IMenuItem > ('MenuItem', menuItemSchema);
