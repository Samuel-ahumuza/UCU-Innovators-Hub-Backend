const { User, Faculty } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {

  const { username, email, password, role, faculty } = req.body; 


  const dbRole = role ? role.toLowerCase() : "student"; 


  if (!username || !email || !password || !dbRole) {
      return res.status(400).json({ message: "Please include username, email, password, and role." });
  }

  // Check if user already exists
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const user = await User.create({
      username,
      email,
      password,
      role: dbRole,

      faculty: faculty || null, 
    });

    if (user) {
      res.status(201).json({
        UserID: user.id,
        UserName: user.username,
        Email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    // Send a 500 status code only if it's truly a server error (e.g., DB connection issue)
    res.status(400).json({ message: "Registration failed. Please check all fields." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

   
    if (user && (await user.matchPassword(password))) { 
      res.json({
        UserID: user.id, 
        UserName: user.username,
        Email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {

      res.status(401).json({ message: "Invalid email or password" }); 
    }
  } catch (error) {
    console.error("CRASH DURING LOGIN (500 Error):", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Admin/Faculty: Get all users
// @route   GET /api/auth/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to retrieve user list." });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
  
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // req.user is already structured (e.g., from your JWT middleware)
    res.status(200).json(req.user); 
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
};