const { Resend } = require("resend");

// ==========================================
// RESEND HTTP EMAIL UTILITY (Bypasses Render SMTP Blocks)
// ==========================================
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Avora <onboarding@resend.dev>", // Free testing domain provided by Resend
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend SDK Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Send Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;