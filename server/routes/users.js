/* ============================================================
   routes/users.js  —  User Profile Routes

   GET  /api/users/dashboard  Full dashboard data
   GET  /api/users/profile    Load the logged-in user's profile
   PUT  /api/users/profile    Save avatar / goal settings
   ============================================================ */

const express     = require('express');
const User        = require('../models/User');
const Workout     = require('../models/Workout');
const protect     = require('../middleware/protect');
const calcStreak  = require('../utils/calcStreak');

const router = express.Router();

// All routes in this file require a valid JWT
router.use(protect);

// ── Workout suggestions by goal + level ───────────────────────
const SUGGESTIONS = {
  lose_weight: {
    beginner:     { title: '30-Min Walk + Stretch',   desc: 'Brisk walk followed by 15 min of full-body stretching.',           duration: 45, intensity: 'Low'       },
    intermediate: { title: 'HIIT Circuit',             desc: '20 min high-intensity intervals + 10 min cardio cooldown.',        duration: 30, intensity: 'High'      },
    advanced:     { title: 'Advanced HIIT Blast',      desc: '45 min HIIT — burpees, jump squats, and mountain climbers.',       duration: 55, intensity: 'Very High' },
  },
  build_muscle: {
    beginner:     { title: 'Full Body Strength',       desc: 'Bodyweight squats, push-ups, rows, lunges — 3 sets each.',         duration: 35, intensity: 'Moderate'  },
    intermediate: { title: 'Upper Body Split',         desc: 'Push/pull — bench press, rows, shoulder press, curls.',           duration: 45, intensity: 'High'      },
    advanced:     { title: 'Heavy Compound Lifts',     desc: 'Squat, Deadlift, Bench Press — heavy weight, low reps.',          duration: 60, intensity: 'Very High' },
  },
  maintain_fitness: {
    beginner:     { title: 'Light Cardio + Core',      desc: '20 min light cardio + 15 min core circuit.',                      duration: 35, intensity: 'Low'       },
    intermediate: { title: 'Steady-State Run',         desc: '30 min run at a comfortable conversational pace.',                duration: 30, intensity: 'Moderate'  },
    advanced:     { title: 'Cross-Training',           desc: '45-min swim, bike, or row for active recovery.',                  duration: 45, intensity: 'Moderate'  },
  },
  endurance: {
    beginner:     { title: '20-Min Easy Jog',          desc: 'Easy, steady-state jog. Focus on form and breathing.',            duration: 20, intensity: 'Low'       },
    intermediate: { title: '5K Run',                   desc: 'Run a 5K at your current comfortable pace. Track your time!',    duration: 35, intensity: 'Moderate'  },
    advanced:     { title: 'Interval Repeats',         desc: '8×400m repeats with 90 sec rest. Push the pace!',                duration: 50, intensity: 'High'      },
  },
  flexibility: {
    beginner:     { title: 'Beginner Yoga Flow',       desc: '30 min gentle yoga — focus on breathing and basic poses.',        duration: 30, intensity: 'Low'       },
    intermediate: { title: 'Vinyasa + Hip Openers',    desc: 'Vinyasa flow with deep hip flexor and back stretches.',           duration: 40, intensity: 'Low'       },
    advanced:     { title: 'Advanced Mobility',        desc: 'Deep stretching, splits practice, shoulder mobility drills.',     duration: 45, intensity: 'Low'       },
  },
  general_health: {
    beginner:     { title: 'Daily Movement',           desc: '20 min walk outdoors + 10 min full-body stretch.',                duration: 30, intensity: 'Low'       },
    intermediate: { title: 'Mixed Activity Circuit',   desc: '30 min alternating cardio and strength movements.',               duration: 30, intensity: 'Moderate'  },
    advanced:     { title: 'Full Training Circuit',    desc: '45 min mixed training — strength, cardio, and mobility.',         duration: 45, intensity: 'Moderate'  },
  },
};

// ── GET /api/users/dashboard ──────────────────────────────────
router.get('/dashboard', async (req, res, next) => {
  try {
    const user  = await User.findById(req.user._id).select('-password');
    const goal  = user.fitnessGoal  || 'general_health';
    const level = user.fitnessLevel || 'beginner';

    // ── Fetch all workouts for this user ──────────────────────
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: 1 })
      .lean();

    // ── Streak (consecutive calendar days) ───────────────────
    const streak = calcStreak(workouts.map(w => w.date));

    // ── This-week stats (rolling 7 days including today) ─────
    const weekStart = new Date();
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);
    weekStart.setUTCHours(0, 0, 0, 0);

    const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekStart);
    const workoutsWeek = weekWorkouts.length;
    const caloriesWeek = weekWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);

    // ── Avatar stage from stored field (updated on each workout log) ─
    const avatarStage = user.avatarStage || 'beginner';

    // ── Today's workout suggestion ────────────────────────────
    // Suggestion tier uses the user-set fitnessLevel (not avatarStage)
    const todaySuggestion = (SUGGESTIONS[goal] && SUGGESTIONS[goal][level])
      ? SUGGESTIONS[goal][level]
      : SUGGESTIONS.general_health.beginner;

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          name:          user.name,
          coachName:     user.coachName     || 'Coach',
          gender:        user.gender        || 'male',
          fitnessGoal:   goal,
          fitnessLevel:  level,
          coachingStyle: user.coachingStyle || 'motivational',
          avatarStage,
        },
        stats: {
          streak,
          workoutsWeek,
          caloriesWeek,
          goalProgress: 0,  // will be real once progress targets are tracked
        },
        todaySuggestion,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/users/profile ────────────────────────────────────
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      success: true,
      profile: {
        name:          user.name,
        email:         user.email,
        coachName:     user.coachName,
        gender:        user.gender,
        fitnessGoal:   user.fitnessGoal,
        fitnessLevel:  user.fitnessLevel,
        coachingStyle: user.coachingStyle,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/users/profile ────────────────────────────────────
router.put('/profile', async (req, res, next) => {
  try {
    const { coachName, gender, fitnessGoal, fitnessLevel, coachingStyle } = req.body;

    const updates = {};
    if (coachName     !== undefined) updates.coachName     = coachName;
    if (gender        !== undefined) updates.gender        = gender;
    if (fitnessGoal   !== undefined) updates.fitnessGoal   = fitnessGoal;
    if (fitnessLevel  !== undefined) updates.fitnessLevel  = fitnessLevel;
    if (coachingStyle !== undefined) updates.coachingStyle = coachingStyle;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile saved!',
      profile: {
        name:          user.name,
        email:         user.email,
        coachName:     user.coachName,
        gender:        user.gender,
        fitnessGoal:   user.fitnessGoal,
        fitnessLevel:  user.fitnessLevel,
        coachingStyle: user.coachingStyle,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

