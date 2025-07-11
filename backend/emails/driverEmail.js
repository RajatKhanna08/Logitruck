import emailClient from "./mailer.js";

export const sendWelcomeEmail = async (driver) => {
  const html = `
    <h2>Welcome ${driver.fullName}!</h2>
    <p>Thanks for registering as a driver with <strong>LogiTruck</strong>.</p>
    <p>Your journey to seamless freight management begins now.</p>
    <p>Stay safe on the road! 🚛</p>
  `;

  await emailClient.sendEmail({
    to: driver.email,
    subject: "Welcome to LogiTruck",
    html,
  });
};

export const sendLoginAlertEmail = async (driver) => {
  const html = `
    <p>Hello ${driver.fullName},</p>
    <p>You just logged into your <strong>LogiTruck</strong> account.</p>
    <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
    <p>If this wasn't you, please contact support immediately.</p>
  `;

  await emailClient.sendEmail({
    to: driver.email,
    subject: "LogiTruck Login Alert",
    html,
  });
};
