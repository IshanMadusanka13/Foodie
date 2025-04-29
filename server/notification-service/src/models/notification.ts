import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: function(this: any) {
            return this.type === 'email' || this.type === 'both';
        }
    },
    userPhone: { 
        type: String, 
        required: function(this: any) {
            return this.type === 'sms' || this.type === 'both';
        }
    },
    message: { type: String, required: true},
    type: { 
        type: String, 
        enum: ['email' , 'sms' , 'both'], 
        default: 'both' 
    },
    sentAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;