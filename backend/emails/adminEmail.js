import emailClient from './mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const FROM_NAME = "Logitruck";
const FROM_EMAIL = process.env.EMAIL_FROM; // Use only configured email

// ========== [1] WELCOME EMAIL ==========
export const sendAdminWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck Admin Panel 🚀";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome aboard as an <strong>Admin</strong> on <strong>Logitruck</strong>.</p>
    <p>You now have access to manage users, orders, and the entire platform efficiently.</p>
    <p>Regards,<br/>Team Logitruck</p>
  `;
  await sendEmail(email, subject, html);
};

// ========== [2] LOGIN NOTIFICATION ==========
export const sendAdminLoginEmail = async (email, name) => {
  const subject = "Logitruck Admin Login Alert";
  const html = `
    <h2>Hello ${name},</h2>
    <p>This is a notification that you logged into your <strong>Admin account</strong> on Logitruck.</p>
    <p>If this wasn't you, please contact support immediately.</p>
    <p>Thanks,<br/>Team Logitruck</p>
  `;
  await sendEmail(email, subject, html);
};

// ========== [BASE FUNCTION for all emails] ==========
const sendEmail = async (to, subject, html) => {
  await emailClient.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};
