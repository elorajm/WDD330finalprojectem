/* ============================================================
   data/exerciseFallbacks.js

   Static exercise suggestions used when the wger API is
   unavailable or returns no usable data.

   7 exercises per goal gives a full week of variety before
   cycling. The route picks one using a day-based seed so the
   suggestion stays stable for the whole day.
   ============================================================ */

module.exports = {

  lose_weight: [
    {
      name:        'Burpees',
      description: 'Start standing, drop into a squat, kick feet back to a push-up position, perform one push-up, jump feet back to squat, then explode upward.',
      muscles:     ['Full Body', 'Core', 'Legs'],
      tip:         'Land softly on each jump to protect your knees.',
    },
    {
      name:        'Jump Squats',
      description: 'Perform a squat then drive up explosively into a jump. Land softly with bent knees and immediately lower back into the next squat.',
      muscles:     ['Quads', 'Glutes', 'Calves'],
      tip:         'Control the landing — don\'t let your knees cave inward.',
    },
    {
      name:        'Mountain Climbers',
      description: 'Start in a high plank. Drive one knee toward your chest, return it, then immediately drive the other. Alternate rapidly to elevate your heart rate.',
      muscles:     ['Core', 'Shoulders', 'Hip Flexors'],
      tip:         'Keep hips level — don\'t let them rise or dip.',
    },
    {
      name:        'High Knees',
      description: 'Run in place, driving each knee up toward your chest. Pump your arms to stay coordinated and keep a fast, consistent tempo.',
      muscles:     ['Hip Flexors', 'Calves', 'Core'],
      tip:         'Stay on the balls of your feet for maximum calorie burn.',
    },
    {
      name:        'Jumping Lunges',
      description: 'Start in a lunge, then jump and switch legs mid-air, landing in a lunge on the opposite side. Maintain an upright torso throughout.',
      muscles:     ['Quads', 'Glutes', 'Hamstrings'],
      tip:         'Use your arms for balance and to generate power.',
    },
    {
      name:        'Skaters',
      description: 'Leap laterally to one side, landing on one foot while the other foot sweeps behind you. Alternate sides like a speed skater.',
      muscles:     ['Glutes', 'Outer Thigh', 'Calves'],
      tip:         'Reach your hand toward the landing foot for a deeper stretch.',
    },
    {
      name:        'Box Step-Ups',
      description: 'Step onto a sturdy box or bench with one foot, drive the other knee up, then step back down. Alternate the leading leg each set.',
      muscles:     ['Quads', 'Glutes', 'Hamstrings'],
      tip:         'Press through your heel as you step up to engage the glute.',
    },
  ],

  build_muscle: [
    {
      name:        'Push-Ups',
      description: 'Start in a high plank. Lower your chest to the floor keeping elbows at 45°, then press back up. Keep your core tight and body in a straight line.',
      muscles:     ['Chest', 'Triceps', 'Shoulders'],
      tip:         'Try close-grip push-ups to shift more work to the triceps.',
    },
    {
      name:        'Dumbbell Bent-Over Rows',
      description: 'Hinge at the hips with a flat back, holding dumbbells. Pull them toward your hips, squeezing your shoulder blades together at the top.',
      muscles:     ['Upper Back', 'Biceps', 'Rear Delts'],
      tip:         'Lead with your elbows, not your hands, to maximise back engagement.',
    },
    {
      name:        'Goblet Squats',
      description: 'Hold a dumbbell or kettlebell at chest height. Squat deep, keeping your chest up and knees tracking over your toes.',
      muscles:     ['Quads', 'Glutes', 'Core'],
      tip:         'Push your knees out with your elbows at the bottom of the rep.',
    },
    {
      name:        'Overhead Press',
      description: 'Hold dumbbells at shoulder height, press them straight overhead until arms are fully extended, then lower with control.',
      muscles:     ['Shoulders', 'Triceps', 'Upper Traps'],
      tip:         'Brace your core to avoid arching your lower back.',
    },
    {
      name:        'Romanian Deadlift',
      description: 'Stand holding dumbbells in front of your thighs. Hinge at the hips, lowering the weights along your legs while keeping a flat back.',
      muscles:     ['Hamstrings', 'Glutes', 'Lower Back'],
      tip:         'Feel the stretch in your hamstrings at the bottom — that\'s the target muscle.',
    },
    {
      name:        'Incline Dumbbell Press',
      description: 'Set a bench to 30–45°. Press dumbbells from chest height upward, bringing them together at the top without locking the elbows.',
      muscles:     ['Upper Chest', 'Shoulders', 'Triceps'],
      tip:         'Lower the weights slowly — the eccentric phase builds the most muscle.',
    },
    {
      name:        'Dumbbell Bicep Curls',
      description: 'Hold dumbbells at your sides, curl them toward your shoulders, squeezing the bicep at the top. Lower slowly and fully extend.',
      muscles:     ['Biceps', 'Forearms'],
      tip:         'Avoid swinging — if you need momentum, the weight is too heavy.',
    },
  ],

  maintain_fitness: [
    {
      name:        'Walking Lunges',
      description: 'Step forward into a lunge, lower your back knee toward the floor, then bring the rear foot forward into the next lunge. Alternate continuously.',
      muscles:     ['Quads', 'Glutes', 'Hamstrings'],
      tip:         'Keep your front shin vertical — knee over ankle, not over toes.',
    },
    {
      name:        'Plank',
      description: 'Hold a forearm or high-plank position with a straight body line from head to heels. Focus on breathing and bracing your core.',
      muscles:     ['Core', 'Shoulders', 'Glutes'],
      tip:         'Squeeze your glutes as well as your abs — the glutes stabilise the lower back.',
    },
    {
      name:        'Glute Bridges',
      description: 'Lie on your back with knees bent. Drive your hips toward the ceiling, squeezing your glutes at the top, then lower with control.',
      muscles:     ['Glutes', 'Hamstrings', 'Lower Back'],
      tip:         'Pause for 2 seconds at the top to increase time under tension.',
    },
    {
      name:        'Band Pull-Aparts',
      description: 'Hold a resistance band at shoulder height with arms extended. Pull the band apart, squeezing your shoulder blades together, then return.',
      muscles:     ['Rear Delts', 'Rhomboids', 'Upper Back'],
      tip:         'Keep your arms straight and avoid shrugging your shoulders.',
    },
    {
      name:        'Side Plank',
      description: 'Lie on your side and prop yourself on one forearm. Raise your hips to form a straight line from head to feet. Hold, then switch sides.',
      muscles:     ['Obliques', 'Glutes', 'Core'],
      tip:         'Stack your feet or stagger them for better balance.',
    },
    {
      name:        'Single-Leg Deadlift',
      description: 'Stand on one foot, hinge forward at the hips, extending the free leg behind you as a counterbalance while lowering a dumbbell toward the floor.',
      muscles:     ['Hamstrings', 'Glutes', 'Core'],
      tip:         'Focus on a fixed point on the floor to improve balance.',
    },
    {
      name:        'Bear Crawl',
      description: 'Start on hands and knees. Lift your knees slightly off the floor and crawl forward for a set distance, keeping hips low and core engaged.',
      muscles:     ['Core', 'Shoulders', 'Quads', 'Hip Flexors'],
      tip:         'Move the opposite arm and leg simultaneously for best coordination.',
    },
  ],

  endurance: [
    {
      name:        'Tempo Run Intervals',
      description: 'Run at a "comfortably hard" pace — you can speak in short phrases but not full sentences. Hold for 20 minutes, or break into 5-min blocks.',
      muscles:     ['Quads', 'Hamstrings', 'Calves', 'Cardiovascular'],
      tip:         'Your tempo pace should feel like a 7–8 out of 10 effort.',
    },
    {
      name:        'Box Jumps',
      description: 'Stand in front of a sturdy box. Bend your knees, swing your arms, and jump onto the box with both feet. Step down carefully and repeat.',
      muscles:     ['Quads', 'Glutes', 'Calves'],
      tip:         'Land with soft knees and a slight forward lean to absorb impact.',
    },
    {
      name:        'Jump Rope',
      description: 'Skip at a steady pace, keeping the rope turning with wrists rather than arms. Maintain a slight knee bend on each landing.',
      muscles:     ['Calves', 'Shoulders', 'Core', 'Cardiovascular'],
      tip:         'Build to 3 rounds of 2 minutes with 30-second rest between rounds.',
    },
    {
      name:        'Stair Climbs',
      description: 'Walk or run up a flight of stairs, taking one or two steps at a time. Walk back down slowly as active recovery, then repeat.',
      muscles:     ['Quads', 'Glutes', 'Calves', 'Cardiovascular'],
      tip:         'Lean slightly forward and drive through your heel on each step.',
    },
    {
      name:        '400 m Repeats',
      description: 'Run one lap (400 m) at a hard but controlled pace. Rest 90 seconds, then repeat. Aim for consistent splits across all rounds.',
      muscles:     ['Legs', 'Core', 'Cardiovascular'],
      tip:         'First rep should feel easy — you\'re pacing for the set, not a sprint.',
    },
    {
      name:        'Rowing Machine Intervals',
      description: 'Row at max effort for 500 m, then rest 2 minutes. Repeat 4–6 times. Maintain good posture — legs, hips, arms on the drive; reverse on recovery.',
      muscles:     ['Back', 'Arms', 'Legs', 'Cardiovascular'],
      tip:         'Power comes from the legs — arms are just the finish.',
    },
    {
      name:        'Cycling Intervals',
      description: 'Cycle at maximum effort for 30 seconds, then easy pedalling for 90 seconds. Repeat 8–10 times. Works on a bike or stationary trainer.',
      muscles:     ['Quads', 'Glutes', 'Calves', 'Cardiovascular'],
      tip:         'Increase resistance rather than just cadence to build real power.',
    },
  ],

  flexibility: [
    {
      name:        'Hip Flexor Lunge Stretch',
      description: 'Step into a deep lunge. Lower your back knee to the floor and push your hips forward until you feel a deep stretch in the front of the rear hip.',
      muscles:     ['Hip Flexors', 'Quads'],
      tip:         'Squeeze the glute of your rear leg to deepen the stretch.',
    },
    {
      name:        'Cat-Cow Flow',
      description: 'On hands and knees, alternate between arching your lower back and dropping your belly (cow) and rounding your spine toward the ceiling (cat).',
      muscles:     ['Spine', 'Core', 'Neck'],
      tip:         'Move slowly with your breath — inhale to cow, exhale to cat.',
    },
    {
      name:        'Pigeon Pose',
      description: 'From a push-up position, bring one knee toward the same-side wrist and extend the other leg behind you. Sink your hips toward the floor.',
      muscles:     ['Glutes', 'Hip Rotators', 'Hip Flexors'],
      tip:         'Place a folded towel under your hip if it doesn\'t reach the floor.',
    },
    {
      name:        'Seated Forward Fold',
      description: 'Sit with legs extended and straight. Hinge forward at the hips, reaching toward your feet while keeping your back as flat as possible.',
      muscles:     ['Hamstrings', 'Lower Back', 'Calves'],
      tip:         'Bend your knees slightly if your hamstrings are very tight — priority is a flat back.',
    },
    {
      name:        'Doorway Chest Opener',
      description: 'Stand in a doorway with arms bent at 90°, forearms on the frame. Step through until you feel a stretch across your chest and front shoulders.',
      muscles:     ['Chest', 'Front Shoulders', 'Biceps'],
      tip:         'Hold 30–60 seconds. Try different arm heights to target different chest fibres.',
    },
    {
      name:        'Supine Spinal Twist',
      description: 'Lie on your back. Draw one knee to your chest and guide it across your body with the opposite hand. Extend the same-side arm to the side.',
      muscles:     ['Spine', 'Glutes', 'Obliques'],
      tip:         'Keep both shoulders flat on the floor throughout the hold.',
    },
    {
      name:        'World\'s Greatest Stretch',
      description: 'Step into a deep lunge. Place your same-side hand inside your front foot, then rotate your top arm toward the ceiling, following it with your eyes.',
      muscles:     ['Hip Flexors', 'Thoracic Spine', 'Hamstrings', 'Glutes'],
      tip:         'Perform 5 reps per side slowly — it\'s a warm-up and cool-down in one.',
    },
  ],

  general_health: [
    {
      name:        'Bodyweight Squats',
      description: 'Stand with feet shoulder-width apart. Lower your hips until thighs are parallel to the floor (or as low as comfortable), then press back up.',
      muscles:     ['Quads', 'Glutes', 'Hamstrings'],
      tip:         'Drive your knees out and chest up throughout the movement.',
    },
    {
      name:        'Bird Dog',
      description: 'On hands and knees, extend your right arm and left leg simultaneously. Hold 2 seconds, return, then switch sides. Keep hips level.',
      muscles:     ['Core', 'Lower Back', 'Glutes'],
      tip:         'Imagine balancing a glass of water on your lower back — keep it level.',
    },
    {
      name:        'Glute Bridges',
      description: 'Lie on your back with knees bent. Drive your hips upward, squeezing your glutes at the top. Lower slowly and repeat.',
      muscles:     ['Glutes', 'Hamstrings', 'Core'],
      tip:         'Add a resistance band just above the knees to activate the outer glutes.',
    },
    {
      name:        'Wall Sit',
      description: 'Slide your back down a wall until thighs are parallel to the floor, knees at 90°. Hold the position for as long as possible.',
      muscles:     ['Quads', 'Glutes', 'Calves'],
      tip:         'Keep your back flat on the wall and don\'t let your knees drift forward.',
    },
    {
      name:        'Dead Bug',
      description: 'Lie on your back with arms pointing at the ceiling and knees bent at 90°. Lower one arm and the opposite leg toward the floor, return, then switch.',
      muscles:     ['Core', 'Hip Flexors', 'Lower Back'],
      tip:         'Press your lower back firmly into the floor throughout every rep.',
    },
    {
      name:        'Reverse Lunges',
      description: 'Step one foot backwards and lower your rear knee toward the floor. Push through the front heel to return to standing. Alternate legs.',
      muscles:     ['Quads', 'Glutes', 'Hamstrings'],
      tip:         'Easier on the knees than forward lunges — great for beginners.',
    },
    {
      name:        'Resistance Band Rows',
      description: 'Anchor a band at chest height. Hold both ends, step back until taut, then pull toward your torso, squeezing shoulder blades together.',
      muscles:     ['Upper Back', 'Biceps', 'Rear Delts'],
      tip:         'Pause and squeeze for 1 second at peak contraction.',
    },
  ],
};
