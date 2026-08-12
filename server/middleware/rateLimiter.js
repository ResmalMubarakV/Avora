const rateLimit = require("express-rate-limit");

// Limit password reset requests: Max 3 requests per 24 hours per IP
const passwordResetLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: "Too many password reset requests from this IP. Please try again after 24 hours.",
  },
});

module.exports = {
  passwordResetLimiter,
};