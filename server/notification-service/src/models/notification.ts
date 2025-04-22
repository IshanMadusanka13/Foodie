import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    message: { type: String, required: true},
    type: { type: String, enum: ['email' , 'sms' , 'both'], default: 'both' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);