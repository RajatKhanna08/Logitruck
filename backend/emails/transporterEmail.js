import transporter from './mailer.js';

// ========== [1] WELCOME EMAIL ==========
export const sendTransporterWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck 🚚";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome to <strong>Logitruck</strong>! We're excited to have you as a Transporter on our platform.</p>
    <p>Start exploring job opportunities and connect with trusted companies now.</p>
    <p>Thanks,<br/>Team Logitruck</p>
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
    <p>Regards,<br/>Team Logitruck</p>
  `;
  await sendEmail(email, subject, html);
};

// ========== [BASE FUNCTION] ==========
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Logitruck" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};
