import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth'; // ✅ Import Auth class
import dotenv from 'dotenv';

dotenv.config();

const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY!,
    apiSecret: process.env.VONAGE_API_SECRET!,
  })
);

export const sendSMS = async (to: string, message: string) => {
  try {
    await vonage.sms.send({
      to,
      from: process.env.VONAGE_VIRTUAL_NUMBER!,
      text: message,
    });
    console.log('✅ SMS sent successfully');
  } catch (error: any) {
    console.error('❌ SMS sending failed:', error.message);
    throw new Error('SMS delivery failed');
  }
};
