"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createDailyLogEntry } from "@/lib/calorie-tracker/daily-log-entries";
import { getFoodById } from "@/lib/calorie-tracker/foods";

type CreateDailyLogEntryFormState = {
  errorMessage: string | null;
};

export async function createDailyLogEntryAction(
  _previousState: CreateDailyLogEntryFormState,
  formData: FormData,
): Promise<CreateDailyLogEntryFormState> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const foodId = String(formData.get("foodId") ?? "").trim();
  const quantityValue = String(formData.get("quantity") ?? "").trim();

  if (!foodId) {
    return {
      errorMessage: "Choose a food first.",
    };
  }

  const quantity = Number(quantityValue);

  if (!quantityValue || Number.isNaN(quantity) || quantity <= 0) {
    return {
      errorMessage: "Quantity must be a number greater than 0.",
    };
  }

  const food = await getFoodById(foodId, userId);

  if (!food) {
    return {
      errorMessage: "The selected food could not be found.",
    };
  }

  await createDailyLogEntry({
    userId,
    foodId: food.id,
    foodNameSnapshot: food.name,
    quantity,
    caloriesPerUnit: food.calories,
    totalCalories: quantity * food.calories,
  });

  revalidatePath("/today");
  redirect("/today");
}
