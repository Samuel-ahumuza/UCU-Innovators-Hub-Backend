const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAllUsers } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes for new user creation and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route to get the currently logged-in user's details
// Any user with a valid token can access this
router.get('/me', protect, getMe);

// Protected route to fetch all users (Admin only)
// This specifically fixes the issue where Admins could not view all users.
router.get('/users', protect, restrictTo(['admin']), getAllUsers);

module.exports = router;