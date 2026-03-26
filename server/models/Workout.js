/* ============================================================
   models/Workout.js  —  Workout Log Entry Schema
   ============================================================ */

const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    // ── What & when ───────────────────────────────────────────
    date: {
      type:     Date,
      required: [true, 'Date is required'],
    },
    title: {
      type:      String,
      required:  [true, 'Workout title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type:    String,
      enum:    ['strength', 'cardio', 'flexibility', 'sports', 'other'],
      default: 'other',
    },

    // ── Performance ───────────────────────────────────────────
    duration: {
      type: Number,         // minutes
      min:  [1, 'Duration must be at least 1 minute'],
    },
    calories: {
      type: Number,
      min:  [0, 'Calories cannot be negative'],
    },

    // ── Notes ─────────────────────────────────────────────────
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

module.exports = mongoose.model('Workout', WorkoutSchema);
