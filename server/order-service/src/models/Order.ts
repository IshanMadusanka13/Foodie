import mongoose, { Schema } from 'mongoose';

export interface IOrder {
    order_id: string;
    customer: Schema.Types.ObjectId;
    restaurant: Schema.Types.ObjectId;
    items: Schema.Types.ObjectId[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: 'card' | 'cash';
    placedAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>({
    order_id: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, required: true },
    restaurant: { type: Schema.Types.ObjectId, required: true },
    items: [{ type: Schema.Types.ObjectId, required: true }],
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    placedAt: { type: Date }
});

export default mongoose.model<IOrder>('Order', OrderSchema);