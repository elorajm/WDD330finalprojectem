/* ============================================================
   middleware/protect.js  —  JWT Authentication Middleware

   Usage: add  protect  as middleware on any route that
   requires the user to be logged in.

   Example:
     const protect = require('../middleware/protect');
     router.get('/me', protect, getMe);
   ============================================================ */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Token must be sent as:  Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized — no token provided'));
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without password) to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized — user no longer exists'));
    }

    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorized — invalid token'));
  }
};

module.exports = protect;
