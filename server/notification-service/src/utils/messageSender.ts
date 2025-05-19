import logger from '../config/logger';
import nodemailer from 'nodemailer';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import dotenv from 'dotenv';

dotenv.config();

const vonage = new Vonage(
    new Auth({
        apiKey: process.env.VONAGE_API_KEY!,
        apiSecret: process.env.VONAGE_API_SECRET!,
    })
);

export async function sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    logger.info(`Sending Mail To: ${to}`);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER!,
                pass: process.env.EMAIL_PASS!,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: content,
        });
        logger.info('Email sent successfully');

    } catch (err) {
        logger.error('Email sending failed : ', err);
        throw new Error('Email delivery failed');
    }

    return true;
}

export async function sendSMS(to: string, content: string): Promise<boolean> {
    logger.info(`MOCK SMS SENT: To: ${to}, Content: ${content}`);

    try {
        await vonage.sms.send({
            to,
            from: process.env.VONAGE_VIRTUAL_NUMBER!,
            text: content,
        });
        logger.info('SMS sent successfully');
    } catch (error: any) {
        logger.error('SMS sending failed:', error.message);
        throw new Error('SMS delivery failed');
    }

    return true;
}
