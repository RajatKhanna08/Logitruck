import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const WHATSAPP_FROM = "whatsapp:+14155238886"; // Always same for sandbox
const formatPhone = (phone) => {
  const phoneStr = String(phone).replace(/\D/g, ''); // ensure string and remove non-digits
  if (phoneStr.startsWith('91')) return `whatsapp:+${phoneStr}`;
  return `whatsapp:+91${phoneStr}`;
};

export const sendWhatsAppRegistration = async (phone, name, role) => {
  try {
    const response = await client.messages.create({
      from: WHATSAPP_FROM,
      to: formatPhone(phone),
      body: `👋 Hello ${name}, your ${role} account has been successfully registered on Logitruck! 🚛 Welcome aboard.`,
    });
    console.log("WhatsApp registration sent:", response.sid);
    return response;
  } catch (error) {
    console.error("WhatsApp registration error:", error.message);
  }
};


export const sendWhatsAppLogin = async (phone, name, role) => {
  try {
    const response = await client.messages.create({
      from: WHATSAPP_FROM,
      to: formatPhone(phone),
      body: `🔐 Hello ${name}, your ${role} account just logged in to Logitruck. If this wasn't you, please contact support. 📞`,
    });
    console.log("WhatsApp login sent:", response.sid);
    return response;
  } catch (error) {
    console.error("WhatsApp login error:", error.message);
  }
};