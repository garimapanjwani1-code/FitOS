/**
 * Meal Plan Data
 * Daily Target: 1500 cal, 120-130g protein, 130-140g carbs, 40-45g fat, 25-30g fiber
 */

export const DAILY_TARGETS = {
  calories: 1500,
  protein: 125,   // midpoint of 120-130
  carbs: 135,     // midpoint of 130-140
  fat: 42,        // midpoint of 40-45
  fiber: 27       // midpoint of 25-30
};

// Default pre-loaded meals (editable by user)
export const DEFAULT_MEALS = [
  {
    id: 'overnight-oats',
    name: 'Overnight Oats',
    slot: 'breakfast',
    ingredients: [
      { name: '30g oats', cal: 117, protein: 4.0, carbs: 20.1, fat: 2.3, fiber: 3.0 },
      { name: '200ml toned milk', cal: 116, protein: 6.6, carbs: 9.6, fat: 6.0, fiber: 0 },
      { name: '1 scoop whey', cal: 120, protein: 24.0, carbs: 3.0, fat: 1.5, fiber: 0 },
      { name: '10g chia seeds', cal: 49, protein: 1.7, carbs: 4.2, fat: 3.1, fiber: 3.4 }
    ],
    calories: 390,
    protein: 35,
    carbs: 36,
    fat: 12,
    fiber: 5
  },
  {
    id: 'chicken-lunch',
    name: 'Chicken Lunch',
    slot: 'lunch',
    ingredients: [
      { name: '100g cooked chicken breast', cal: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0 },
      { name: '180g boiled sweet potato', cal: 155, protein: 2.9, carbs: 36.2, fat: 0.2, fiber: 5.4 },
      { name: '100g Greek yogurt', cal: 59, protein: 10.3, carbs: 3.6, fat: 0.4, fiber: 0 },
      { name: '100g cucumber', cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 }
    ],
    calories: 394,
    protein: 45,
    carbs: 43,
    fat: 4,
    fiber: 6
  },
  {
    id: 'choco-omelette-lunch',
    name: 'Chocolate Omelette + Yogurt + Papaya',
    slot: 'lunch',
    ingredients: [
      { name: 'Chocolate protein omelette', cal: 350, protein: 32.0, carbs: 40.0, fat: 8.0, fiber: 4.0 },
      { name: 'Yogurt', cal: 60, protein: 5.0, carbs: 7.0, fat: 1.5, fiber: 0 },
      { name: 'Papaya (~150g)', cal: 92, protein: 3.7, carbs: 18.0, fat: 0.6, fiber: 3.9 }
    ],
    calories: 502,
    protein: 41,
    carbs: 65,
    fat: 10,
    fiber: 8
  },
  {
    id: 'preworkout-shake',
    name: 'Pre-workout Shake',
    slot: 'preworkout',
    ingredients: [
      { name: '1 large banana', cal: 105, protein: 1.3, carbs: 27.0, fat: 0.3, fiber: 3.1 },
      { name: '200ml toned milk', cal: 116, protein: 6.6, carbs: 9.6, fat: 6.0, fiber: 0 },
      { name: '½ scoop whey', cal: 60, protein: 12.0, carbs: 1.5, fat: 0.8, fiber: 0 }
    ],
    calories: 281,
    protein: 20,
    carbs: 38,
    fat: 7,
    fiber: 3
  },
  {
    id: 'chicken-dinner',
    name: 'Chicken Dinner',
    slot: 'dinner',
    ingredients: [
      { name: '100g cooked chicken breast', cal: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0 },
      { name: '150g plain curd', cal: 90, protein: 5.3, carbs: 6.8, fat: 4.5, fiber: 0 },
      { name: '2 boiled carrots (~120g)', cal: 45, protein: 1.0, carbs: 11.0, fat: 0.2, fiber: 3.5 },
      { name: '100g cucumber', cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 }
    ],
    calories: 315,
    protein: 38,
    carbs: 21,
    fat: 8,
    fiber: 4
  }
];

// Meal slots in order
export const MEAL_SLOTS = ['breakfast', 'lunch', 'preworkout', 'dinner', 'extra'];

export const SLOT_LABELS = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  preworkout: '⚡ Pre-Workout',
  dinner: '🌙 Dinner',
  extra: '🍎 Extra'
};
