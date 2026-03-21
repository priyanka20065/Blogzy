const jwt = require("jsonwebtoken");
require("dotenv").config();


const User = require("../models/UserSetting");

const auth = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Login required" });
  }

  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user from DB to get role and isPremium
    const user = await User.findById(decoded.id).select("role isPremium");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = { id: decoded.id, role: user.role, isPremium: user.isPremium };
    console.log(`[Auth Middleware] Token verified for user: ${decoded.id}, role: ${user.role}, isPremium: ${user.isPremium}`);
    next();
  } catch (error) {
    console.error(`[Auth Middleware] JWT Error:`, error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Middleware to require premium subscription
const requirePremium = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ message: 'Premium subscription required' });
  }
  next();
};

// Middleware to require writer (author) role
const requireWriter = (req, res, next) => {
  if (!req.user || req.user.role !== 'author') {
    return res.status(403).json({ message: 'Writer subscription required' });
  }
  next();
};

module.exports = { auth, requirePremium, requireWriter };
