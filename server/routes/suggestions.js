/* ============================================================
   routes/suggestions.js  —  Daily Exercise Suggestion

   GET /api/suggestions/today
     - Tries the free wger exercise API first
     - Falls back to local data if wger is unreachable/slow
     - Uses today's date as a deterministic seed so the same
       suggestion is returned all day for a given user
   ============================================================ */

const express    = require('express');
const https      = require('https');
const protect    = require('../middleware/protect');
const FALLBACKS  = require('../data/exerciseFallbacks');

const router = express.Router();
router.use(protect);

// ── wger category IDs per fitness goal ───────────────────────
// wger categories: 8=Arms, 9=Legs, 10=Abs, 11=Chest, 12=Back, 13=Shoulders, 14=Calves
const GOAL_CATEGORIES = {
  lose_weight:      [9, 10, 14],   // Legs, Abs, Calves — high-rep cardio moves
  build_muscle:     [11, 12, 8],   // Chest, Back, Arms
  maintain_fitness: [12, 13, 11],  // Back, Shoulders, Chest
  endurance:        [9, 14],       // Legs, Calves
  flexibility:      [10, 13],      // Abs, Shoulders — best approximation in wger
  general_health:   [8, 11, 12],   // Arms, Chest, Back
};

// Sets recommendation by level
const SETS_BY_LEVEL = {
  beginner:     '2–3',
  intermediate: '3–4',
  advanced:     '4–5',
};

// Reps recommendation by goal + level
function repsFor(goal, level) {
  if (goal === 'lose_weight' || goal === 'endurance') {
    return { beginner: '15–20', intermediate: '20–25', advanced: '25–30' }[level] || '15–20';
  }
  if (goal === 'build_muscle') {
    return { beginner: '10–12', intermediate: '8–10', advanced: '6–8' }[level] || '10–12';
  }
  if (goal === 'flexibility') {
    return { beginner: '30 sec', intermediate: '45 sec', advanced: '60 sec' }[level] || '30 sec';
  }
  return { beginner: '12–15', intermediate: '10–12', advanced: '10–12' }[level] || '12–15';
}

// ── Fetch JSON from a URL with a timeout ─────────────────────
function fetchJSON(url, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'FitnessGoalTracker/1.0' } },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          try   { resolve(JSON.parse(raw)); }
          catch { reject(new Error('Invalid JSON from wger')); }
        });
      }
    );
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('wger request timed out'));
    });
    req.on('error', reject);
  });
}

// Strip HTML tags from wger description strings
function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Stable day-based numeric seed ────────────────────────────
// e.g. "2025-03-24" → 20250324
function daySeed() {
  return parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''), 10);
}

// ── GET /api/suggestions/today ────────────────────────────────
router.get('/today', async (req, res, next) => {
  try {
    const user  = req.user;
    const goal  = user.fitnessGoal  || 'general_health';
    const level = user.fitnessLevel || 'beginner';
    const seed  = daySeed();
    const sets  = SETS_BY_LEVEL[level]    || '3';
    const reps  = repsFor(goal, level);
    const date  = new Date().toISOString().split('T')[0];

    let suggestion = null;
    let source     = 'fallback';

    // ── 1. Try wger API ───────────────────────────────────────
    try {
      const categories = GOAL_CATEGORIES[goal] || GOAL_CATEGORIES.general_health;
      const categoryId = categories[seed % categories.length];

      const url  = `https://wger.de/api/v2/exercise/?format=json&language=2&category=${categoryId}&limit=50`;
      const data = await fetchJSON(url);

      // Only use exercises with a meaningful English description
      const valid = (data.results || []).filter(e =>
        e.name &&
        stripHtml(e.description).length >= 30
      );

      if (valid.length > 0) {
        const ex   = valid[seed % valid.length];
        const desc = stripHtml(ex.description);

        suggestion = {
          name:     ex.name,
          // Trim to a readable length
          description: desc.length > 280 ? desc.slice(0, 277) + '…' : desc,
          muscles:  (ex.muscles || []).map(m => m.name_en || m.name).filter(Boolean),
          category: ex.category?.name || '',
          sets,
          reps,
        };
        source = 'wger';
      }
    } catch (wgerErr) {
      // wger is down, slow, or returned nothing useful — fall through to local data
      console.warn('[Suggestions] wger unavailable:', wgerErr.message);
    }

    // ── 2. Fallback to local data ─────────────────────────────
    if (!suggestion) {
      const pool = FALLBACKS[goal] || FALLBACKS.general_health;
      const ex   = pool[seed % pool.length];
      suggestion = { ...ex, sets, reps };
      source = 'fallback';
    }

    res.status(200).json({
      success: true,
      date,
      suggestion: { ...suggestion, source },
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
