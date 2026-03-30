/* ============================================================
   routes/progress.js  —  Progress / Charts Data

   GET /api/progress?days=30
     days: 7 | 30 | 90 | all (default 30)

   Returns chart-ready data for:
     - Weight over time
     - Workouts per week
     - Exercise minutes per week
     - Summary stats + current streak
   ============================================================ */

const express    = require('express');
const Workout    = require('../models/Workout');
const Metric     = require('../models/Metric');
const protect    = require('../middleware/protect');
const calcStreak = require('../utils/calcStreak');

const router = express.Router();

router.use(protect);

// ── Helpers ───────────────────────────────────────────────────

// Returns a Date set to the Monday (UTC) of the given date's week
function weekStart(date) {
  const d   = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// "Mar 24" style label
function fmtShort(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  });
}

// Build an array of consecutive weekly bucket objects ending this week
function buildWeekBuckets(numWeeks) {
  const thisWeek = weekStart(new Date());
  const buckets  = [];

  for (let i = numWeeks - 1; i >= 0; i--) {
    const d = new Date(thisWeek);
    d.setUTCDate(d.getUTCDate() - i * 7);
    buckets.push({
      key:     d.toISOString(),
      label:   fmtShort(d),
      count:   0,   // workout sessions
      minutes: 0,   // total active minutes
    });
  }
  return buckets;
}

// ── GET /api/progress ────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const raw  = req.query.days;
    const days = (raw === 'all' || !raw) ? null : Math.max(1, parseInt(raw) || 30);

    // ── Date filter (applied to workouts and metrics) ─────────
    const filter = { user: req.user._id };
    if (days) {
      const cutoff = new Date();
      cutoff.setUTCDate(cutoff.getUTCDate() - days);
      cutoff.setUTCHours(0, 0, 0, 0);
      filter.date = { $gte: cutoff };
    }

    // Run all three DB queries in parallel
    const [workouts, metrics, allWorkoutDates] = await Promise.all([
      Workout.find(filter).sort({ date: 1 }).lean(),
      Metric.find(filter).sort({ date: 1 }).lean(),
      // All-time workout dates needed for accurate streak calculation
      Workout.find({ user: req.user._id }, { date: 1 }).lean(),
    ]);

    // ── Summary stats ─────────────────────────────────────────
    const totalWorkouts = workouts.length;
    const activeMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
    const streak        = calcStreak(allWorkoutDates.map(w => w.date));

    let weightChange = null;
    if (metrics.length >= 2) {
      const first = metrics[0].weight;
      const last  = metrics[metrics.length - 1].weight;
      const diff  = parseFloat((last - first).toFixed(1));
      const unit  = metrics[metrics.length - 1].weightUnit || 'lbs';
      weightChange = (diff >= 0 ? '+' : '') + diff + ' ' + unit;
    } else if (metrics.length === 1) {
      weightChange = metrics[0].weight + ' ' + (metrics[0].weightUnit || 'lbs');
    }

    // ── Weight chart ─────────────────────────────────────────
    // Up to 30 most-recent entries so the chart isn't too crowded
    const weightSlice = metrics.slice(-30);
    const weightChart = {
      labels: weightSlice.map(m => fmtShort(m.date)),
      data:   weightSlice.map(m => m.weight),
      unit:   weightSlice.length ? (weightSlice[weightSlice.length - 1].weightUnit || 'lbs') : 'lbs',
    };

    // ── Weekly activity buckets ───────────────────────────────
    const numWeeks = days ? Math.min(Math.ceil(days / 7) + 1, 16) : 12;
    const buckets  = buildWeekBuckets(numWeeks);

    for (const w of workouts) {
      const key = weekStart(w.date).toISOString();
      const bin = buckets.find(b => b.key === key);
      if (bin) {
        bin.count++;
        bin.minutes += w.duration || 0;
      }
    }

    const workoutsPerWeek = {
      labels: buckets.map(b => b.label),
      data:   buckets.map(b => b.count),
    };
    const minutesPerWeek = {
      labels: buckets.map(b => b.label),
      data:   buckets.map(b => b.minutes),
    };

    // ── Workout history for table (newest first, up to 50) ────
    const history = workouts
      .slice()           // don't mutate the sorted array
      .reverse()
      .slice(0, 50)
      .map(w => ({
        date:     fmtShort(w.date),
        title:    w.title,
        type:     w.type     || 'other',
        duration: w.duration || null,
        calories: w.calories || null,
      }));

    res.status(200).json({
      success: true,
      progress: {
        summary: {
          totalWorkouts,
          activeMinutes,
          weightChange,
          streak,
        },
        weight:          weightChart,
        workoutsPerWeek,
        minutesPerWeek,
        history,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
