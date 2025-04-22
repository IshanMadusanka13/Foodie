import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: String,
    type: String,
    recipient: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);