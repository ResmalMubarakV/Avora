const jwt = require("jsonwebtoken");

// ==========================================
// GENERATE JWT TOKEN
// ==========================================
/**
 * Generates a JSON Web Token for user authentication.
 * @param {string|ObjectId} id - The user's database ID.
 * @returns {string} The signed JWT, valid for 30 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;