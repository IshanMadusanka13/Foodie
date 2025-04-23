import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, message: string) => {
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
            subject: 'Order Confirmation',
            text: message,
        });
        console.log('✅ Email sent successfully');
    } catch (err) {
        console.error('❌ Email sending failed : ', err);
        throw new Error('Email delivery failed');
    }
};