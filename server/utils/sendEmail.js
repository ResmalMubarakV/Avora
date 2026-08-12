const nodemailer = require("nodemailer");

// ==========================================
// EMAIL SENDER UTILITY
// ==========================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // Fail fast (10s) instead of hanging indefinitely
  greetingTimeout: 10000,
  socketTimeout: 10000,
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