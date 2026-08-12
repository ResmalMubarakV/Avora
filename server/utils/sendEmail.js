const nodemailer = require("nodemailer");

// ==========================================
// EMAIL SENDER UTILITY (Port 587 STARTTLS)
// ==========================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

/**
 * Sends an email using the configured Gmail transporter.
 * @param {Object} options - Email configuration options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject line of the email.
 * @param {string} options.html - HTML body content of the email.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Avora" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Nodemailer Send Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;