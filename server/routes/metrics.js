/* ============================================================
   routes/metrics.js  —  Body Metrics Routes

   POST /api/metrics        Save a new metric entry
   GET  /api/metrics        Get all entries for the logged-in user
   ============================================================ */

const express = require('express');
const Metric  = require('../models/Metric');
const protect = require('../middleware/protect');

const router = express.Router();

// All routes require a valid JWT
router.use(protect);

// ── POST /api/metrics ─────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const {
      date,
      weight,
      weightUnit,
      bodyFat,
      waist,
      height,
      restingHeartRate,
      sleep,
      energyLevel,
      notes,
    } = req.body;

    // Validate required fields
    if (!date)   return res.status(400).json({ success: false, message: 'Date is required.' });
    if (!weight) return res.status(400).json({ success: false, message: 'Weight is required.' });

    const metric = await Metric.create({
      user: req.user._id,
      date,
      weight,
      weightUnit: weightUnit || 'lbs',
      bodyFat:          bodyFat          !== undefined ? bodyFat          : undefined,
      waist:            waist            !== undefined ? waist            : undefined,
      height:           height           !== undefined ? height           : undefined,
      restingHeartRate: restingHeartRate !== undefined ? restingHeartRate : undefined,
      sleep:            sleep            !== undefined ? sleep            : undefined,
      energyLevel:      energyLevel      !== undefined ? energyLevel      : undefined,
      notes:            notes            || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Metrics saved!',
      metric,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/metrics ──────────────────────────────────────────
// Returns entries newest-first, max 50
router.get('/', async (req, res, next) => {
  try {
    const metrics = await Metric.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      count:   metrics.length,
      metrics,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
