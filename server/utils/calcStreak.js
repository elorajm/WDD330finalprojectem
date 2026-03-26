/* ============================================================
   utils/calcStreak.js

   Calculates the current consecutive-day workout streak from
   an array of workout dates.

   Rules:
     - Deduplicate dates (multiple workouts on one day = 1 streak day)
     - Streak must start from TODAY or YESTERDAY
       (if you haven't worked out today yet, yesterday still counts)
     - Count consecutive calendar days backwards from the start date
     - Any gap of 2+ days breaks the streak

   @param  {Array<Date|string>} dates  Workout dates (any order)
   @returns {number}                   Current streak in days
   ============================================================ */

function calcStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  // ── Normalise to unique YYYY-MM-DD strings (UTC) ─────────
  const daySet = new Set(
    dates.map(d => {
      const dt = new Date(d);
      return dt.toISOString().split('T')[0];  // "2025-03-24"
    })
  );

  // Sort newest → oldest
  const days = Array.from(daySet).sort().reverse();

  // ── Build today / yesterday strings (UTC) ────────────────
  const now       = new Date();
  const todayStr  = now.toISOString().split('T')[0];

  const yd = new Date(now);
  yd.setUTCDate(yd.getUTCDate() - 1);
  const yesterdayStr = yd.toISOString().split('T')[0];

  // ── Streak must start from today or yesterday ─────────────
  if (days[0] !== todayStr && days[0] !== yesterdayStr) return 0;

  // ── Count consecutive days ────────────────────────────────
  let streak = 1;

  for (let i = 1; i < days.length; i++) {
    const newer = new Date(days[i - 1]);
    const older = new Date(days[i]);

    // Gap in whole days between the two dates
    const gapDays = Math.round((newer - older) / (1000 * 60 * 60 * 24));

    if (gapDays === 1) {
      streak++;
    } else {
      break; // gap > 1 day — streak is broken
    }
  }

  return streak;
}

module.exports = calcStreak;
