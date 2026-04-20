import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";

import { getTodaysDailyLogEntries } from "@/lib/calorie-tracker/daily-log-entries";
import { getFoods } from "@/lib/calorie-tracker/foods";
import TodayLogForm from "@/app/today/today-log-form";

export default async function TodayPage() {
  await connection();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const foods = await getFoods(userId);
  const entries = await getTodaysDailyLogEntries(userId);
  const totalCalories = entries.reduce(
    (total, entry) => total + entry.totalCalories,
    0,
  );

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-zinc-600">Daily calorie log for today.</p>
      </div>

      <TodayLogForm foods={foods} />

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-600">Today&apos;s calorie total</p>
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

        {entries.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">
            No entries found for today.
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
