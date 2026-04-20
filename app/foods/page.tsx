import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";

import FoodsPageClient from "@/app/foods/foods-page-client";
import { getFoods } from "@/lib/calorie-tracker/foods";

export default async function FoodsPage() {
  await connection();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const foods = await getFoods(userId);

  return <FoodsPageClient foods={foods} />;
}
