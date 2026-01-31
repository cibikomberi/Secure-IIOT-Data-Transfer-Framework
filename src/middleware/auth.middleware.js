// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const userRepository = require("../repository/user.repository");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const userId = payload.sub;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔐 attach user to request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
