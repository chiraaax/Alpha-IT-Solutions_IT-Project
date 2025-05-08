import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD  
        }
    });

    await transporter.sendMail({
        from: `"Alpha IT Solution" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: message
    });
};

export default sendEmail; 
 
