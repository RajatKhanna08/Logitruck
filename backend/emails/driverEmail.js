import emailClient from './mailer.js';

const FROM_NAME = "LogiTruck";
const FROM_EMAIL = process.env.EMAIL_FROM;

export const sendWelcomeEmail = async (driver) => {
  const subject = "Welcome to LogiTruck 🚛";
  const html = `
    <h2>Welcome ${driver.fullName}!</h2>
    <p>Thanks for registering as a driver with <strong>LogiTruck</strong>.</p>
    <p>Your journey to seamless freight management begins now.</p>
    <p>Stay safe on the road! 🚛</p>
  `;
  await sendEmail(driver.email, subject, html);
};

export const sendLoginAlertEmail = async (driver) => {
  const subject = "LogiTruck Login Alert";
  const html = `
    <p>Hello ${driver.fullName},</p>
    <p>You just logged into your <strong>LogiTruck</strong> account.</p>
    <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
    <p>If this wasn't you, please contact support immediately.</p>
  `;
  await sendEmail(driver.email, subject, html);
};

const sendEmail = async (to, subject, html) => {
  await emailClient.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};
