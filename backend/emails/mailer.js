import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in', 
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_FROM,      // e.g., support@logitruck.org.in
    pass: process.env.EMAIL_PASSWORD,  // yby8cihhTYPu
  },
});

export default transporter;
