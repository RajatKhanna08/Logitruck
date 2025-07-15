import emailClient from './mailer.js';

const FROM_NAME = "Logitruck";
const FROM_EMAIL = process.env.EMAIL_FROM;

// Define the reusable HTML signature
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

export const sendCompanyWelcomeEmail = async (email, name) => {
  const subject = "Welcome to Logitruck 🚚";
  const html = `
    <h2>Hi ${name},</h2>
    <p>Welcome to <strong>Logitruck</strong>! We're excited to have you as a Company partner on our platform.</p>
    <p>Start creating job orders and find trusted transporters now.</p>
    <p>Thanks,<br/>Team Logitruck</p>
    ${signature}
  `;
  await sendEmail(email, subject, html);
};

export const sendCompanyLoginEmail = async (email, name) => {
  const subject = "Logitruck Login Notification";
  const html = `
    <h2>Hello ${name},</h2>
    <p>This is a confirmation that you just logged into your Company account on <strong>Logitruck</strong>.</p>
    <p>If this wasn't you, please contact our support immediately.</p>
    <p>Regards,<br/>Team Logitruck</p>
    ${signature}
  `;
  await sendEmail(email, subject, html);
};

const sendEmail = async (to, subject, html) => {
  await emailClient.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};
