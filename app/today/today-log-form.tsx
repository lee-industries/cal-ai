"use client";

import { useActionState, useState } from "react";

import { createDailyLogEntryAction } from "@/app/today/actions";
import type { Food } from "@/lib/calorie-tracker/types";

type TodayLogFormProps = {
  foods: Food[];
};

const initialCreateDailyLogEntryFormState = {
  errorMessage: null,
};

export default function TodayLogForm({ foods }: TodayLogFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState(foods[0]?.id ?? "");
  const [formState, formAction, isPending] = useActionState(
    createDailyLogEntryAction,
    initialCreateDailyLogEntryFormState,
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredFoods = foods.filter((food) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [food.name, food.brand, food.notes]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  const availableSelectedFood = filteredFoods.some(
    (food) => food.id === selectedFoodId,
  );
  const selectedFoodIdForSubmit =
    availableSelectedFood ? selectedFoodId : filteredFoods[0]?.id ?? "";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <form action={formAction} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto]">
          <label className="space-y-1">
            <span className="text-sm font-medium text-zinc-700">Search food</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search saved foods"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-zinc-700">Quantity</span>
            <input
              type="number"
              name="quantity"
              min="0"
              step="0.1"
              defaultValue="1"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPending || !selectedFoodIdForSubmit}
              className="w-full rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Log Food"}
            </button>
          </div>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Selected food</span>
          <select
            name="foodId"
            value={selectedFoodIdForSubmit}
            onChange={(event) => setSelectedFoodId(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {filteredFoods.length === 0 ? (
              <option value="">No foods match your search</option>
            ) : (
              filteredFoods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.calories} cal)
                </option>
              ))
            )}
          </select>
        </label>

        {formState.errorMessage ? (
          <p className="text-sm text-red-600">{formState.errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
