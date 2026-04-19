"use client";

import { useState, type FormEvent } from "react";

import {
  getAllFoods,
  getTodaysEntries,
} from "@/lib/calorie-tracker/mock-data";
import type { DailyLogEntry, Food } from "@/lib/calorie-tracker/types";

function getTodayDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayPage() {
  const [foods] = useState<Food[]>(() => getAllFoods());
  const [entries, setEntries] = useState<DailyLogEntry[]>(() => getTodaysEntries());
  const [selectedFoodId, setSelectedFoodId] = useState(foods[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalCalories = entries.reduce(
    (total, entry) => total + entry.totalCalories,
    0,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedFood = foods.find((food) => food.id === selectedFoodId);
    const parsedQuantity = Number(quantity);

    if (!selectedFood) {
      setErrorMessage("Choose a food first.");
      return;
    }

    if (!quantity.trim() || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage("Quantity must be a number greater than 0.");
      return;
    }

    const today = getTodayDateString();
    const newEntry: DailyLogEntry = {
      id: `entry-${crypto.randomUUID()}`,
      date: today,
      foodId: selectedFood.id,
      foodNameSnapshot: selectedFood.name,
      quantity: parsedQuantity,
      caloriesPerUnit: selectedFood.calories,
      totalCalories: parsedQuantity * selectedFood.calories,
      rawInput: `${parsedQuantity} x ${selectedFood.name}`,
      createdAt: new Date().toISOString(),
    };

    setEntries((currentEntries) => [newEntry, ...currentEntries]);
    setQuantity("1");
    setErrorMessage(null);
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-zinc-600">
          Daily calorie log for today.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Food</span>
            <select
              value={selectedFoodId}
              onChange={(event) => setSelectedFoodId(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex w-full flex-col gap-1 sm:w-32">
            <span className="text-sm font-medium text-zinc-700">Quantity</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Log Food
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-600">Today&apos;s running total</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {totalCalories} cal
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-950">
            Today&apos;s entries
          </h2>
        </div>

        <ul className="divide-y divide-zinc-200">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-4 p-4"
            >
              <div className="space-y-1">
                <p className="font-medium text-zinc-950">
                  {entry.foodNameSnapshot}
                </p>
                <p className="text-sm text-zinc-600">
                  Quantity: {entry.quantity}
                </p>
                <p className="text-sm text-zinc-600">
                  Calories per unit: {entry.caloriesPerUnit}
                </p>
                {entry.rawInput ? (
                  <p className="text-xs text-zinc-500">{entry.rawInput}</p>
                ) : null}
              </div>

              <div className="text-right">
                <p className="font-medium text-zinc-950">
                  {entry.totalCalories} cal
                </p>
                <p className="text-sm text-zinc-600">Total calories</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
