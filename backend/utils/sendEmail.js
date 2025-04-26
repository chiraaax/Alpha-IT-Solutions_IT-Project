// sendEmail.js
import nodemailer from 'nodemailer';
import orderStatusUpdate from '../emailTemplates/orderStatusUpdate.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Alpha IT Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: orderStatusUpdate(text),
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
