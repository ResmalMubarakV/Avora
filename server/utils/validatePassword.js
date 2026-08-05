// ==========================================
// PASSWORD VALIDATION UTILITY
// ==========================================
/**
 * Validates a password against strict security requirements.
 * Requires at least 8 characters, containing at least 1 uppercase letter, 
 * 1 lowercase letter, 1 number, and 1 special character.
 * 
 * @param {string} password - The password string to validate.
 * @returns {boolean} True if the password meets all requirements.
 */
const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]).{8,}$/;

  return passwordRegex.test(password);
};

module.exports = validatePassword;