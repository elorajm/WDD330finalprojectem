/* ============================================================
   utils/calcAvatarStage.js

   Determines an avatar's progression stage based on the total
   number of workouts the user has logged.

   Thresholds
     beginner      →   0 –  4 total workouts
     intermediate  →   5 – 14 total workouts
     advanced      →  15 +  total workouts

   @param  {number} totalWorkouts  Lifetime logged workout count
   @returns {'beginner'|'intermediate'|'advanced'}
   ============================================================ */

function calcAvatarStage(totalWorkouts) {
  const count = Number(totalWorkouts) || 0;

  if (count >= 15) return 'advanced';
  if (count >= 5)  return 'intermediate';
  return 'beginner';
}

module.exports = calcAvatarStage;
