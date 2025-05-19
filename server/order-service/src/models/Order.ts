import mongoose, { Schema } from 'mongoose';

export interface IOrder {
    order_id: string;
    customer: String;
    restaurant: String;
    items: [{
        menuItemId: String,
        menuItemName: String,
        menuItemPrice: number,
        qty: number
    }];
    orderAmount: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: 'card' | 'cash';
    placedAt: Date;
}

export interface IOrderCreate {
    order_id: string;
    customer: String;
    restaurant: String;
    items: [{
        menuItemId: String,
        menuItemName: String,
        menuItemPrice: number,
        qty: number
    }];
    orderAmount: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    paymentMethod: 'card' | 'cash';
    placedAt: Date;
    restaurantLocation: {
        latitude: number,
        longitude: number
    },
    customerLocation: {
        latitude: number,
        longitude: number
    }
}

const OrderSchema: Schema = new Schema<IOrder>({
    order_id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    restaurant: { type: String, required: true },
    items: [{
        menuItemId: { type: String, required: true },
        menuItemName: { type: String, required: true },
        menuItemPrice: { type: Number, required: true },
        qty: { type: Number, required: true }
    }],
    orderAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    paymentMethod: { type: String, required: true },
    placedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);