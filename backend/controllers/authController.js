const User = require("../models/User");
const Organization = require("../models/Organization");
const generateToken = require("../utils/generateToken");

// ===============================
// @desc    Register new user
// @route   POST /api/auth/register
// ===============================
exports.register = async (req, res) => {
  try {
    const { email, password, orgName } = req.body;

    // 1. Basic validation
    if (!email || !password || !orgName) {
      return res.status(400).json({
        message: "Email, password and organization name are required"
      });
    }

    // 2. Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // 3. Check JWT_SECRET early (CRITICAL FIX)
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    // 4. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 5. Create organization
    const organization = await Organization.create({
      name: orgName
    });

    if (!organization) {
      return res.status(500).json({
        message: "Failed to create organization"
      });
    }

    // 6. Create user (password hashed by model)
    const user = await User.create({
      email,
      password,
      organization: organization._id
    });

    if (!user) {
      return res.status(500).json({
        message: "Failed to create user"
      });
    }

    // 7. Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({ token });

  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({
      message: "Registration failed"
    });
  }
};

// ===============================
// @desc    Login user
// @route   POST /api/auth/login
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    // 3. Find user
    const user = await User.findOne({ email });

    // 4. Validate password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 5. Generate token
    const token = generateToken(user._id);

    res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR FULL:", error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};
