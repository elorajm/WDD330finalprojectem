/* ============================================================
   routes/workouts.js  —  Workout Log Routes

   POST   /api/workouts        Log a new workout
   GET    /api/workouts        Get all workouts for the logged-in user
   PUT    /api/workouts/:id    Edit a workout (owner only)
   DELETE /api/workouts/:id    Remove a workout (owner only)
   ============================================================ */

const express         = require('express');
const Workout         = require('../models/Workout');
const User            = require('../models/User');
const protect         = require('../middleware/protect');
const calcAvatarStage = require('../utils/calcAvatarStage');

const router = express.Router();

// All routes require a valid JWT
router.use(protect);

// ── POST /api/workouts ────────────────────────────────────────
// Logs a new workout and automatically updates the user's avatarStage
router.post('/', async (req, res, next) => {
  try {
    const { date, title, type, duration, calories, notes } = req.body;

    // Validate required fields
    if (!date)  return res.status(400).json({ success: false, message: 'Date is required.' });
    if (!title) return res.status(400).json({ success: false, message: 'Workout title is required.' });

    // ── 1. Save the workout entry ─────────────────────────────
    const workout = await Workout.create({
      user:     req.user._id,
      date,
      title,
      type:     type     || 'other',
      duration: duration || undefined,
      calories: calories || undefined,
      notes:    notes    || undefined,
    });

    // ── 2. Recalculate avatarStage from total workout count ───
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
    const newStage      = calcAvatarStage(totalWorkouts);

    // ── 3. Persist the updated avatarStage on the user doc ────
    await User.findByIdAndUpdate(req.user._id, { avatarStage: newStage });

    res.status(201).json({
      success:        true,
      message:        'Workout logged!',
      workout,
      totalWorkouts,
      avatarStage:    newStage,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/workouts ─────────────────────────────────────────
// Returns all workouts for the user, newest first (max 100)
router.get('/', async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100)
      .lean();

    res.status(200).json({
      success:  true,
      count:    workouts.length,
      workouts,
    });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/workouts/:id ─────────────────────────────────────
// Update a workout — the logged-in user must own the entry
router.put('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found.' });
    }

    // Ownership check
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this workout.' });
    }

    const { date, title, type, duration, calories, notes } = req.body;

    if (date)  workout.date  = date;
    if (title) workout.title = title;
    if (type)  workout.type  = type;

    // Allow clearing duration / calories / notes by sending null or empty string
    workout.duration = duration  ? Number(duration)  : undefined;
    workout.calories = calories  ? Number(calories)  : undefined;
    workout.notes    = notes     ? String(notes)     : undefined;

    const updated = await workout.save();

    res.status(200).json({
      success: true,
      message: 'Workout updated!',
      workout: updated,
    });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/workouts/:id ──────────────────────────────────
// Remove a workout — the logged-in user must own the entry
router.delete('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found.' });
    }

    // Ownership check
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this workout.' });
    }

    await workout.deleteOne();

    // Recalculate avatarStage after deletion
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
    const newStage      = calcAvatarStage(totalWorkouts);
    await User.findByIdAndUpdate(req.user._id, { avatarStage: newStage });

    res.status(200).json({
      success:      true,
      message:      'Workout deleted.',
      totalWorkouts,
      avatarStage:  newStage,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

