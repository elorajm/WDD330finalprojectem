/* ============================================================
   models/Metric.js  —  Body Metrics / Vitals Schema
   ============================================================ */

const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    // ── Date of measurement ───────────────────────────────────
    date: {
      type:     Date,
      required: [true, 'Date is required'],
    },

    // ── Body composition ─────────────────────────────────────
    weight: {
      type:    Number,
      required: [true, 'Weight is required'],
      min:     [1, 'Weight must be positive'],
    },
    weightUnit: {
      type:    String,
      enum:    ['lbs', 'kg'],
      default: 'lbs',
    },
    bodyFat: {
      type: Number,
      min:  [0,   'Body fat cannot be negative'],
      max:  [100, 'Body fat cannot exceed 100%'],
    },
    waist: {
      type: Number,
      min:  [0, 'Waist measurement must be positive'],
    },
    height: {
      type: Number,
      min:  [0, 'Height must be positive'],
    },

    // ── Vitals ───────────────────────────────────────────────
    restingHeartRate: {
      type: Number,
      min:  [0,   'Heart rate must be positive'],
      max:  [300, 'Heart rate seems too high'],
    },
    sleep: {
      type: Number,
      min:  [0,  'Sleep hours must be positive'],
      max:  [24, 'Sleep cannot exceed 24 hours'],
    },
    energyLevel: {
      type: Number,
      min:  [1, 'Energy level min is 1'],
      max:  [10, 'Energy level max is 10'],
    },

    // ── Notes ────────────────────────────────────────────────
    notes: {
      type:      String,
      trim:      true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Metric', MetricSchema);
