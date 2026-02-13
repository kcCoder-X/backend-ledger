const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access, token is missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);

      req.user = user
      return next();
      
    }catch (error) {
      return res.status(401).json({ message: "Unauthorized access, invalid token" });
    }

  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = authMiddleware;