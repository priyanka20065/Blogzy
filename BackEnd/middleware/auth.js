const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Login required" });
  }

  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    console.log(`[Auth Middleware] Token verified for user: ${decoded.id}`);
    next();
  } catch (error) {
    console.error(`[Auth Middleware] JWT Error:`, error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
module.exports = auth;
