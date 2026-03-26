/* ============================================================
   routes/auth.js  —  Authentication Routes

   POST  /api/auth/register   Create a new account
   POST  /api/auth/login      Log in with email + password
   GET   /api/auth/me         Get current logged-in user
   ============================================================ */

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const protect = require('../middleware/protect');

const router = express.Router();

// ── Helper: sign a JWT and return it ─────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields are present
    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Please provide name, email, and password'));
    }

    // Check if email already in use
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409);
      return next(new Error('An account with that email already exists'));
    }

    // Create user — password is hashed automatically via pre-save hook
    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    // Explicitly select password since schema hides it by default
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me  (protected) ────────────────────────────
router.get('/me', protect, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id:        req.user._id,
        name:      req.user.name,
        email:     req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
