"use client";

import { useActionState, useState } from "react";

import { createFoodAction } from "@/app/foods/actions";
import type { Food } from "@/lib/calorie-tracker/types";

type FoodsPageClientProps = {
  foods: Food[];
};

const initialCreateFoodFormState = {
  errorMessage: null,
};

export default function FoodsPageClient({ foods }: FoodsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [formState, formAction, isPending] = useActionState(
    createFoodAction,
    initialCreateFoodFormState,
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
              Save a new food to the library.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingFood((currentValue) => !currentValue)}
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {isAddingFood ? "Cancel" : "Add Food"}
          </button>
        </div>

        {isAddingFood ? (
          <form action={formAction} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">Name</span>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">
                  Calories
                </span>
                <input
                  type="number"
                  name="calories"
                  step="1"
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
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium text-zinc-700">Brand</span>
                <input
                  type="text"
                  name="brand"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Notes</span>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </label>

            {formState.errorMessage ? (
              <p className="text-sm text-red-600">{formState.errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Food"}
            </button>
          </form>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-700">Search foods</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name or brand"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        {filteredFoods.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">
            {foods.length === 0
              ? "No foods found in the database yet."
              : "No foods match your search."}
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {filteredFoods.map((food) => (
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
        )}
      </div>
    </section>
  );
}
