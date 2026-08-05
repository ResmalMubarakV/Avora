const nodemailer = require("nodemailer");

// ==========================================
// EMAIL SENDER UTILITY
// ==========================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the configured Gmail transporter.
 * @param {Object} options - Email configuration options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject line of the email.
 * @param {string} options.html - HTML body content of the email.
 */
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Avora" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;