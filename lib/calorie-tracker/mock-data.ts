import type { DailyLogEntry, Food } from "@/lib/calorie-tracker/types";

function getTodayDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildTimestamp(date: string, time: string): string {
  return `${date}T${time}`;
}

const today = getTodayDateString();

export const mockFoods: Food[] = [
  {
    id: "food-oats",
    name: "Rolled Oats",
    calories: 150,
    servingSize: "1 bowl",
    brand: "Generic",
    notes: "Simple breakfast staple",
  },
  {
    id: "food-greek-yogurt",
    name: "Greek Yogurt",
    calories: 120,
    servingSize: "1 cup",
    brand: "Fage",
  },
  {
    id: "food-chicken-rice",
    name: "Chicken and Rice Bowl",
    calories: 480,
    servingSize: "1 bowl",
    notes: "Lunch default",
  },
  {
    id: "food-banana",
    name: "Banana",
    calories: 105,
    servingSize: "1 medium banana",
  },
];

export const mockDailyLogEntries: DailyLogEntry[] = [
  {
    id: "entry-breakfast-oats",
    date: today,
    foodId: "food-oats",
    foodNameSnapshot: "Rolled Oats",
    quantity: 1,
    caloriesPerUnit: 150,
    totalCalories: 150,
    rawInput: "1 bowl rolled oats",
    createdAt: buildTimestamp(today, "08:00:00"),
  },
  {
    id: "entry-snack-banana",
    date: today,
    foodId: "food-banana",
    foodNameSnapshot: "Banana",
    quantity: 1,
    caloriesPerUnit: 105,
    totalCalories: 105,
    rawInput: "banana",
    createdAt: buildTimestamp(today, "10:30:00"),
  },
  {
    id: "entry-lunch-bowl",
    date: today,
    foodId: "food-chicken-rice",
    foodNameSnapshot: "Chicken and Rice Bowl",
    quantity: 1,
    caloriesPerUnit: 480,
    totalCalories: 480,
    rawInput: "chicken rice bowl",
    createdAt: buildTimestamp(today, "12:45:00"),
  },
];

export function getAllFoods(): Food[] {
  return [...mockFoods];
}

export function getTodaysEntries(): DailyLogEntry[] {
  const currentDate = getTodayDateString();

  return mockDailyLogEntries.filter((entry) => entry.date === currentDate);
}

export function getTodaysTotalCalories(): number {
  return getTodaysEntries().reduce(
    (total, entry) => total + entry.totalCalories,
    0,
  );
}
