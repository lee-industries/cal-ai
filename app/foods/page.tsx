"use client";

import { useState } from "react";

import { getAllFoods } from "@/lib/calorie-tracker/mock-data";
import type { Food } from "@/lib/calorie-tracker/types";

type FoodFormValues = {
  name: string;
  calories: string;
  servingSize: string;
  brand: string;
  notes: string;
};

const initialFormValues: FoodFormValues = {
  name: "",
  calories: "",
  servingSize: "",
  brand: "",
  notes: "",
};

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>(() => getAllFoods());
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [formValues, setFormValues] =
    useState<FoodFormValues>(initialFormValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = formValues.name.trim();
    const trimmedCalories = formValues.calories.trim();
    const parsedCalories = Number(trimmedCalories);

    if (!trimmedName) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!trimmedCalories || Number.isNaN(parsedCalories)) {
      setErrorMessage("Calories must be a number.");
      return;
    }

    const newFood: Food = {
      id: `food-${crypto.randomUUID()}`,
      name: trimmedName,
      calories: parsedCalories,
      servingSize: formValues.servingSize.trim() || undefined,
      brand: formValues.brand.trim() || undefined,
      notes: formValues.notes.trim() || undefined,
    };

    setFoods((currentFoods) => [newFood, ...currentFoods]);
    setFormValues(initialFormValues);
    setErrorMessage(null);
    setIsAddingFood(false);
  }

  function handleToggleAddFood() {
    setIsAddingFood((currentValue) => !currentValue);
    setErrorMessage(null);
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Foods</h1>
        <p className="text-sm text-zinc-600">Reusable food library.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-zinc-950">Add a food</p>
            <p className="text-sm text-zinc-600">
              Create foods locally for now.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAddFood}
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {isAddingFood ? "Cancel" : "Add Food"}
          </button>
        </div>

        {isAddingFood ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">Name</span>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">
                  Calories
                </span>
                <input
                  type="text"
                  name="calories"
                  value={formValues.calories}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">
                  Serving size
                </span>
                <input
                  type="text"
                  name="servingSize"
                  value={formValues.servingSize}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">Brand</span>
                <input
                  type="text"
                  name="brand"
                  value={formValues.brand}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Notes</span>
              <textarea
                name="notes"
                value={formValues.notes}
                onChange={handleFieldChange}
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </label>

            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            >
              Save Food
            </button>
          </form>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-200">
          {foods.map((food) => (
            <li key={food.id} className="space-y-1 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-zinc-950">{food.name}</p>
                  <p className="text-sm text-zinc-600">
                    {food.servingSize ?? "1 serving"}
                    {food.brand ? ` • ${food.brand}` : ""}
                  </p>
                </div>

                <p className="whitespace-nowrap font-medium text-zinc-950">
                  {food.calories} cal
                </p>
              </div>

              {food.notes ? (
                <p className="text-sm text-zinc-600">{food.notes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
