import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    message: { type: String, required: true},
    type: { type: String, enum: ['email' , 'sms' , 'both'], default: 'both' },
    sentAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;