const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

/** 
 * - User register controller 
 * - POST: /api/auth/register 
 */
const userRegisterController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(422).json({
        message: "Email already exists",
        status: "failed",
      });
    }

    // Create new user
    const user = await userModel.create({ email, name, password });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // prevents JavaScript on the frontend from accessing the cookie, protecting against XSS attacks.
      secure: true, // HTTPS only
      sameSite: "None", // allow cross-origin
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/** 
 * - User login controller 
 * - POST: /api/auth/login 
 */
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true, // prevents JavaScript on the frontend from accessing the cookie, protecting against XSS attacks.
      secure: true, // HTTPS only
      sameSite: "None", // allow cross-origin
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    // Send response
    res.status(200).json({
      message: "User login successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { userRegisterController, userLoginController };
