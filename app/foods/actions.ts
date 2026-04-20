"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createFood } from "@/lib/calorie-tracker/foods";

type CreateFoodFormState = {
  errorMessage: string | null;
};

export async function createFoodAction(
  _previousState: CreateFoodFormState,
  formData: FormData,
): Promise<CreateFoodFormState> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") ?? "").trim();
  const caloriesValue = String(formData.get("calories") ?? "").trim();
  const servingSize = String(formData.get("servingSize") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    return {
      errorMessage: "Name is required.",
    };
  }

  const calories = Number(caloriesValue);

  if (!caloriesValue || Number.isNaN(calories)) {
    return {
      errorMessage: "Calories must be a number.",
    };
  }

  await createFood({
    userId,
    name,
    calories,
    servingSize: servingSize || undefined,
    brand: brand || undefined,
    notes: notes || undefined,
  });

  revalidatePath("/foods");
  redirect("/foods");
}
