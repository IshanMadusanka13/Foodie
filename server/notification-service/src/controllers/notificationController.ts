import { Request, Response } from 'express';
import { sendEmail } from '../utils/email';
import { sendSMS } from '../utils/sms';
const Notification = require('../models/notification');

export const notifyUser = async (req: Request, res: Response) => {
    const { userEmail, userPhone, message, type } = req.body;

    try {
        if (type === 'email' || type === 'both') await sendEmail(userEmail, message);
        if (type === 'sms' || type === 'both') await sendSMS(userPhone, message);

        const notification = new Notification({ userEmail, userPhone, message, type });
        await notification.save();

        req.app.get('io').emit('notification', notification);

        res.status(200).json({ success: true, notification });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: 'An unknown error occurred' });
        }   
    }
};