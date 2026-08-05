// ==========================================
// ADMIN MIDDLEWARE
// ==========================================
/**
 * Middleware to protect routes that require administrator privileges.
 * Ensures the user is authenticated and possesses the 'admin' role.
 */
const admin = (req, res, next) => {
  try {
    // Check if the user object exists (populated by auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Proceed to the next middleware/controller if user is an admin
    if (req.user.role === "admin") {
      return next();
    }

    // Deny access if the role is anything else
    return res.status(403).json({ message: "Not authorized as admin" });
  } catch (error) {
    console.error("Admin Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = admin;