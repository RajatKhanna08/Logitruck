import emailClient from './mailer.js';

// ========== [1] WELCOME EMAIL ==========
export const sendCompanyWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck 🚚";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome to <strong>Logitruck</strong>! We're excited to have you as a Company partner on our platform.</p>
    <p>Start creating job orders and find trusted transporters now.</p>
    <p>Thanks,<br/>Team Logitruck</p>
  `;
  await sendEmail(email, subject, html);
};

// ========== [2] LOGIN NOTIFICATION ==========
export const sendCompanyLoginEmail = async (email, name) => {
  const subject = "Logitruck Login Notification";
  const html = `
    <h2>Hello ${name},</h2>
    <p>This is a confirmation that you just logged into your Company account on <strong>Logitruck</strong>.</p>
    <p>If this wasn't you, please contact our support immediately.</p>
    <p>Regards,<br/>Team Logitruck</p>
  `;
  await sendEmail(email, subject, html);
};

// ========== [BASE FUNCTION] ==========
const sendEmail = async (to, subject, html) => {
  await emailClient.sendMail({
    from: `"Logitruck" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};
