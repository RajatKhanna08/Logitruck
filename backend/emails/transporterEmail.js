import emailClient from './mailer.js';

const FROM_NAME = "Logitruck";
const FROM_EMAIL = process.env.EMAIL_FROM;

// Common signature block
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
export const sendTransporterWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck 🚚";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome to <strong>Logitruck</strong>! We're excited to have you as a Transporter on our platform.</p>
    <p>Start exploring job opportunities and connect with trusted companies now.</p>
    ${signature}
  `;
  await sendEmail(email, subject, html);
};

// ========== [2] LOGIN NOTIFICATION ==========
export const sendTransporterLoginEmail = async (email, name) => {
  const subject = "Logitruck Login Notification";
  const html = `
    <h2>Hello ${name},</h2>
    <p>This is a confirmation that you just logged into your Transporter account on <strong>Logitruck</strong>.</p>
    <p>If this wasn't you, please contact our support immediately.</p>
    ${signature}
  `;
  await sendEmail(email, subject, html);
};

// ========== [BASE FUNCTION] ==========
const sendEmail = async (to, subject, html) => {
  await emailClient.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};
