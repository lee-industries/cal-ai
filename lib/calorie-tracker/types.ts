export type Food = {
  id: string;
  userId: string;
  name: string;
  calories: number;
  servingSize?: string;
  brand?: string;
  notes?: string;
};

export type FoodAlias = {
  id: string;
  foodId: Food["id"];
  alias: string;
};

export type DailyLogEntry = {
  id: string;
  userId: string;
  date: string;
  foodId?: Food["id"];
  foodNameSnapshot: string;
  quantity: number;
  caloriesPerUnit: number;
  totalCalories: number;
  rawInput: string;
  createdAt: string;
};
