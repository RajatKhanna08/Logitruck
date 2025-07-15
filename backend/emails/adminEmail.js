import emailClient from './mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const FROM_NAME = "Logitruck";
const FROM_EMAIL = process.env.EMAIL_FROM;

// Common LogiTruck Email Signature
const signature = `
  <br/><br/>
  <p>Best regards,<br/>
  <strong>LogiTruck Support Team</strong><br/>
  +91-9810508819<br/>
  <a href="https://www.logitruck.org.in">www.logitruck.org.in</a><br/>
  <a href="mailto:support@logitruck.org.in">support@logitruck.org.in</a><br/>
  India</p>
  <p><em>LogiTruck – Delivering the Future of Freight</em></p>
`;

// ========== [1] WELCOME EMAIL ==========
export const sendAdminWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck Admin Panel 🚀";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome aboard as an <strong>Admin</strong> on <strong>Logitruck</strong>.</p>
    <p>You now have access to manage users, orders, and the entire platform efficiently.</p>
    ${signature}
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
    ${signature}
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
