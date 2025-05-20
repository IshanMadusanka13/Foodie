import logger from '../config/logger';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
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
    logger.info(`Sending SMS To: ${to}, Content: ${content}`);

    try {
        // Send SMS using Twilio
        const message = await twilioClient.messages.create({
            body: content,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: to
        });
        
        logger.info(`SMS sent successfully with SID: ${message.sid}`);
    } catch (error: any) {
        logger.error('SMS sending failed:', error.message);
        throw new Error('SMS delivery failed');
    }

    return true;
}
