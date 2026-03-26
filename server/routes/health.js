/* ============================================================
   routes/health.js  —  API Health Check Route
   GET /api/health  → confirms the server is running
   ============================================================ */

const express = require('express');
const router  = express.Router();

// @route   GET /api/health
// @desc    Check that the API is online
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'Fitness Goal Tracker API is up and running!',
    timestamp:   new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
