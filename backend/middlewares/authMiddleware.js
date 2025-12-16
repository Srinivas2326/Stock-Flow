const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes with JWT
const protect = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user & attach to request
    const user = await User.findById(decoded.id).populate("organization");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized, invalid token"
    });
  }
};

module.exports = protect;
