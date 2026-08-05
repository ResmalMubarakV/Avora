const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// REQUIRED AUTHENTICATION (STRICT)
// ==========================================
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("Protect Error", error);
      return res.status(401).json({ message: "Not Authorized, Token Failed" });
    }
  }

  return res.status(401).json({ message: "Not Authorized, No Token" });
};

// ==========================================
// ADMIN EXCLUSIVE MIDDLEWARE
// ==========================================
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as an admin" });
};

// ==========================================
// RESTRICT ADMIN FROM USER ROUTES
// ==========================================
const restrictAdminFromUserRoutes = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return res.status(403).json({ 
      message: "Administrators are restricted from accessing user features." 
    });
  }
  return next();
};

// ==========================================
// OPTIONAL AUTHENTICATION (LENIENT)
// ==========================================
const protectOptional = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

module.exports = {
  protect,
  admin,
  restrictAdminFromUserRoutes,
  protectOptional,
};