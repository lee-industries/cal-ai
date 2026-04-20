import type { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";
import type { DailyLogEntry } from "@/lib/calorie-tracker/types";

export type CreateDailyLogEntryInput = {
  userId: string;
  foodId: string;
  foodNameSnapshot: string;
  quantity: number;
  caloriesPerUnit: number;
  totalCalories: number;
};

type DailyLogEntryDocument = {
  _id: ObjectId;
  userId: string;
  date: string;
  foodId?: string;
  foodNameSnapshot: string;
  quantity: number;
  caloriesPerUnit: number;
  totalCalories: number;
  rawInput?: string;
  createdAt: string;
};

type NewDailyLogEntryDocument = Omit<DailyLogEntryDocument, "_id">;

function getTodayDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(date);
}

function mapDailyLogEntryDocument(
  document: DailyLogEntryDocument,
): DailyLogEntry {
  return {
    id: document._id.toString(),
    userId: document.userId,
    date: document.date,
    foodId: document.foodId,
    foodNameSnapshot: document.foodNameSnapshot,
    quantity: document.quantity,
    caloriesPerUnit: document.caloriesPerUnit,
    totalCalories: document.totalCalories,
    rawInput: document.rawInput ?? "",
    createdAt: document.createdAt,
  };
}

export async function getTodaysDailyLogEntries(
  userId: string,
): Promise<DailyLogEntry[]> {
  const database = await getDatabase();
  const dailyLogEntriesCollection =
    database.collection<DailyLogEntryDocument>("dailyLogEntries");
  const today = getTodayDateString();

  const documents = await dailyLogEntriesCollection
    .find({ date: today, userId })
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map(mapDailyLogEntryDocument);
}

export async function createDailyLogEntry(
  input: CreateDailyLogEntryInput,
): Promise<DailyLogEntry> {
  const database = await getDatabase();
  const dailyLogEntriesCollection =
    database.collection<DailyLogEntryDocument>("dailyLogEntries");
  const today = getTodayDateString();

  const documentToInsert: NewDailyLogEntryDocument = {
    userId: input.userId,
    date: today,
    foodId: input.foodId,
    foodNameSnapshot: input.foodNameSnapshot,
    quantity: input.quantity,
    caloriesPerUnit: input.caloriesPerUnit,
    totalCalories: input.totalCalories,
    rawInput: "",
    createdAt: new Date().toISOString(),
  };

  const result = await dailyLogEntriesCollection.insertOne(documentToInsert);
  const createdEntry = await dailyLogEntriesCollection.findOne({
    _id: result.insertedId,
  });

  if (!createdEntry) {
    throw new Error("Failed to load the created daily log entry.");
  }

  return mapDailyLogEntryDocument(createdEntry);
}
