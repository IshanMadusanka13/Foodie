import { Request, Response } from 'express';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../utils/email';
import { sendSMS } from '../utils/sms';

export const notifyUser = async (req: Request, res: Response) => {
    const { message, type, recipient } = req.body;

    try {
        const savedNotification = await createNotification({ message, type, recipient });

        if (type === 'email') await sendEmail(recipient, 'Order Confirmation', message);
        else if (type === 'sms') await sendSMS(recipient, message);

        res.status(200).json({ success: true, notification: savedNotification });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
};