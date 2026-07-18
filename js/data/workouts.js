/**
 * Weekly Workout Plan - 6 Days (Updated)
 * Each exercise has an `image` field → filename in images/exercises/
 */

export const WORKOUT_PLAN = {
  monday: {
    title: 'PUSH A (Chest Focus)',
    time: '~85–90 min',
    warmup: [
      'Band Pull Aparts ×15',
      'Shoulder CARs ×10',
      'Wall Slides ×10',
      'Scapular Push-ups ×10',
      'Band External Rotations ×15'
    ],
    exercises: [
      { name: 'Bench Press', type: 'Compound', sets: 4, reps: '6–8', muscles: 'Chest, Front Delts, Triceps', note: 'Heaviest press first while fresh', image: 'bench-press.jpg' },
      { name: 'Incline DB Press', type: 'Compound', sets: 3, reps: '8–10', muscles: 'Upper Chest, Front Delts', note: 'Targets upper chest after main lift', image: 'incline-db-press.jpg' },
      { name: 'Seated DB Shoulder Press', type: 'Compound', sets: 3, reps: '8–10', muscles: 'Shoulders, Triceps', note: 'Shoulders warmed up from chest work', image: 'seated-db-shoulder-press.jpg' },
      { name: 'Machine Chest Press', type: 'Machine', sets: 3, reps: '10–12', muscles: 'Chest', note: 'Continue chest volume safely after free weights', image: 'machine-chest-press.jpg' },
      { name: 'Rope Pushdown', type: 'Isolation', sets: 3, reps: '10–12', muscles: 'Triceps (Lateral & Medial Head)', note: 'Direct triceps work after pressing', image: 'rope-pushdown.jpg' },
      { name: 'Overhead Rope Extension', type: 'Isolation', sets: 3, reps: '12–15', muscles: 'Triceps (Long Head)', note: 'Completes triceps development', image: 'overhead-rope-extension.jpg' },
      { name: 'Push-ups', type: 'Compound', sets: 2, reps: 'Failure', muscles: 'Chest, Triceps, Core', note: 'Bodyweight finisher to fully fatigue pressing muscles', image: 'push-ups.jpg' }
    ],
    core: [
      { name: 'Incline Bench Crunch', sets: 3, reps: '15' },
      { name: 'Dead Bug', sets: 3, reps: '10/side' }
    ]
  },

  tuesday: {
    title: 'PULL A (Thickness Focus)',
    time: '~80–90 min',
    warmup: [
      'Dead Hang ×30 sec',
      'Scapular Pull-ups ×10',
      'Thoracic Rotations ×10/side',
      'Band Face Pulls ×15'
    ],
    exercises: [
      { name: 'Assisted Pull-up', type: 'Compound', sets: 4, reps: '6–8', muscles: 'Lats, Biceps', note: 'Highest-skill movement first', image: 'assisted-pull-up.jpg' },
      { name: 'Chest Supported Row', type: 'Compound', sets: 4, reps: '8–10', muscles: 'Mid Back, Rhomboids', note: 'Heavy horizontal pull', image: 'chest-supported-row.jpg' },
      { name: 'Seated Cable Row', type: 'Compound', sets: 3, reps: '10–12', muscles: 'Mid Back, Lats', note: 'Adds back thickness', image: 'seated-cable-row.jpg' },
      { name: 'Straight Arm Pulldown', type: 'Isolation', sets: 3, reps: '12–15', muscles: 'Lats', note: 'Isolates lats after compounds', image: 'straight-arm-pulldown.jpg' },
      { name: 'Incline Curl', type: 'Isolation', sets: 3, reps: '10–12', muscles: 'Biceps (Long Head)', note: 'Heavy biceps work first', image: 'incline-curl.jpg' },
      { name: 'Hammer Curl', type: 'Isolation', sets: 3, reps: '12', muscles: 'Brachialis, Forearms', note: 'Builds arm thickness and grip', image: 'hammer-curl.jpg' }
    ],
    core: []
  },

  wednesday: {
    title: 'LEGS A (Quad + Strength)',
    time: '~90 min',
    warmup: [
      'Leg Swings (front/back & side)',
      'World\'s Greatest Stretch',
      'Deep Squat Hold',
      'Bodyweight Squats',
      'Banded Walks ×15',
      'Glute Bridges ×15'
    ],
    exercises: [
      { name: 'Barbell Hip Thrust', type: 'Compound', sets: 4, reps: '8', muscles: 'Glutes', note: 'Priority glute lift while fresh', image: 'hip-thrust.jpg' },
      { name: 'Back Squat', type: 'Compound', sets: 4, reps: '6–8', muscles: 'Quads, Glutes, Core', note: 'Main strength movement', image: 'back-squat.jpg' },
      { name: 'Bulgarian Split Squat', type: 'Compound', sets: 3, reps: '10/leg', muscles: 'Quads, Glutes', note: 'Unilateral strength and balance', image: 'bulgarian-split-squat.jpg' },
      { name: 'Leg Press', type: 'Compound', sets: 3, reps: '12', muscles: 'Quads, Glutes', note: 'Adds volume without balance demands', image: 'leg-press.jpg' },
      { name: 'Leg Extension', type: 'Isolation', sets: 3, reps: '15', muscles: 'Quads', note: 'Finishes quads safely', image: 'leg-extension.jpg' },
      { name: 'Standing Calf Raise', type: 'Isolation', sets: 4, reps: '15', muscles: 'Calves', note: 'Direct calf work', image: 'standing-calf-raise.jpg' }
    ],
    core: [
      { name: 'Captain\'s Chair Knee Raise', sets: 3, reps: '10–12' },
      { name: 'Bird Dog', sets: 3, reps: '10/side' }
    ]
  },

  thursday: {
    title: 'PUSH B (Triceps Focus)',
    time: '~75–85 min',
    warmup: [
      'Band Pull Aparts ×15',
      'Shoulder CARs ×10',
      'Wall Slides ×10',
      'Scapular Push-ups ×10',
      'Band External Rotations ×15'
    ],
    exercises: [
      { name: 'Seated DB Shoulder Press', type: 'Compound', sets: 4, reps: '8', muscles: 'Shoulders, Triceps', note: 'Heavy overhead press first', image: 'seated-db-shoulder-press.jpg' },
      { name: 'Incline DB Press', type: 'Compound', sets: 3, reps: '10', muscles: 'Upper Chest', note: 'Secondary compound press', image: 'incline-db-press.jpg' },
      { name: 'Pec Deck', type: 'Isolation', sets: 3, reps: '12–15', muscles: 'Chest', note: 'Chest isolation after compounds', image: 'pec-deck.jpg' },
      { name: 'Skull Crushers', type: 'Isolation', sets: 3, reps: '10–12', muscles: 'Triceps (Long Head)', note: 'Heavy triceps while elbows fresh', image: 'skull-crushers.jpg' },
      { name: 'Rope Pushdown', type: 'Isolation', sets: 3, reps: '12–15', muscles: 'Triceps', note: 'High-rep triceps finisher', image: 'rope-pushdown.jpg' },
      { name: 'Cable Lateral Raise', type: 'Isolation', sets: 3, reps: '15', muscles: 'Side Delts', note: 'Maintenance work for shoulders', image: 'cable-lateral-raise.jpg' }
    ],
    core: []
  },

  friday: {
    title: 'PULL B (Width + Biceps)',
    time: '~75–80 min',
    warmup: [
      'Dead Hang ×30 sec',
      'Scapular Pull-ups ×10',
      'Thoracic Rotations ×10/side',
      'Band Face Pulls ×15'
    ],
    exercises: [
      { name: 'Wide-Grip Lat Pulldown', type: 'Compound', sets: 4, reps: '8–10', muscles: 'Lats', note: 'Main width builder', image: 'wide-grip-pulldown.jpg' },
      { name: 'Single-Arm DB Row', type: 'Compound', sets: 3, reps: '10/arm', muscles: 'Lats, Mid Back', note: 'Fixes strength imbalances', image: 'single-arm-db-row.jpg' },
      { name: 'Reverse Pec Deck', type: 'Isolation', sets: 3, reps: '15', muscles: 'Rear Delts', note: 'Rear shoulder isolation after pulls', image: 'reverse-pec-deck.jpg' },
      { name: 'EZ-Bar Curl', type: 'Isolation', sets: 3, reps: '10', muscles: 'Biceps', note: 'Heavy biceps work', image: 'ez-bar-curl.jpg' },
      { name: 'Cable Curl', type: 'Isolation', sets: 3, reps: '12–15', muscles: 'Biceps', note: 'Constant tension to finish', image: 'cable-curl.jpg' },
      { name: 'Face Pull', type: 'Isolation', sets: 3, reps: '15', muscles: 'Rear Delts, Traps', note: 'Improves posture and shoulder health', image: 'face-pull.jpg' }
    ],
    core: []
  },

  saturday: {
    title: 'LEGS B (Glute + Hamstrings)',
    time: '~90–100 min',
    warmup: [
      'Hip Circles',
      'Leg Swings',
      'Walking Lunges',
      'Deep Squat Hold',
      'Frog Pumps ×20',
      'Banded Walks ×15',
      'Clamshells ×15'
    ],
    exercises: [
      { name: 'Romanian Deadlift', type: 'Compound', sets: 4, reps: '8', muscles: 'Hamstrings, Glutes', note: 'Main hip-hinge movement while fresh', image: 'romanian-deadlift.jpg' },
      { name: 'Barbell Hip Thrust', type: 'Compound', sets: 4, reps: '10', muscles: 'Glutes', note: 'Second weekly glute priority lift', image: 'hip-thrust.jpg' },
      { name: 'Walking Lunges', type: 'Compound', sets: 3, reps: '12/leg', muscles: 'Glutes, Quads', note: 'Unilateral functional movement', image: 'walking-lunges.jpg' },
      { name: 'Lying Leg Curl', type: 'Isolation', sets: 3, reps: '12', muscles: 'Hamstrings', note: 'Direct hamstring work', image: 'lying-leg-curl.jpg' },
      { name: 'Cable Kickback', type: 'Isolation', sets: 3, reps: '15', muscles: 'Glute Max', note: 'Peak glute contraction', image: 'cable-kickback.jpg' },
      { name: 'Cable Hip Abduction', type: 'Isolation', sets: 3, reps: '15/leg', muscles: 'Glute Medius', note: 'Improves glute shape and hip stability', image: 'cable-hip-abduction.jpg' }
    ],
    core: [
      { name: 'Reverse Crunch', sets: 3, reps: '15' },
      { name: 'Side Plank', sets: 3, reps: '30–45 sec/side' },
      { name: 'Farmer\'s Carry', sets: 3, reps: '30–40 m' }
    ]
  }
};

export const DAY_LABELS = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT'
};

export const DAY_COLORS = {
  monday: '#FF6B6B',
  tuesday: '#4ECDC4',
  wednesday: '#45B7D1',
  thursday: '#96E6A1',
  friday: '#DDA0DD',
  saturday: '#FFB347'
};
