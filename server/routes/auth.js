const express = require('express');
const authMiddleware = require('../middlewares/auth');
const {register,login} = require('../controllers/authController')
const router = express.Router();

// @route   POST /auth/signup
// @desc    Register new user
router.post('/register', register);

// @route   POST /auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

// @route   GET /auth/user
// @desc    Get logged-in user info
// @access  Protected
router.get('/user', authMiddleware, async (req, res) => {
  res.json({ user: {name: req.user.name,email: req.user.email,role: req.user.role} });
});

module.exports = router;
