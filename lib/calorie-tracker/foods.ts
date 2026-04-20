import { ObjectId, type Filter } from "mongodb";

import { getDatabase } from "@/lib/mongodb";
import type { Food } from "@/lib/calorie-tracker/types";

export type CreateFoodInput = {
  userId: string;
  name: string;
  calories: number;
  servingSize?: string;
  brand?: string;
  notes?: string;
};

type FoodDocument = {
  _id: ObjectId;
  userId: string;
  name: string;
  calories: number;
  servingSize?: string;
  brand?: string;
  notes?: string;
};

type NewFoodDocument = Omit<FoodDocument, "_id">;

function mapFoodDocument(document: FoodDocument): Food {
  return {
    id: document._id.toString(),
    userId: document.userId,
    name: document.name,
    calories: document.calories,
    servingSize: document.servingSize,
    brand: document.brand,
    notes: document.notes,
  };
}

export async function getFoods(userId: string): Promise<Food[]> {
  const database = await getDatabase();
  const foodsCollection = database.collection<FoodDocument>("foods");
  const documents = await foodsCollection
    .find({ userId })
    .sort({ name: 1 })
    .toArray();

  return documents.map(mapFoodDocument);
}

export async function getFoodById(
  id: string,
  userId: string,
): Promise<Food | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const database = await getDatabase();
  const foodsCollection = database.collection<FoodDocument>("foods");
  const filter: Filter<FoodDocument> = {
    _id: new ObjectId(id),
    userId,
  };

  const document = await foodsCollection.findOne(filter);

  return document ? mapFoodDocument(document) : null;
}

export async function createFood(input: CreateFoodInput): Promise<Food> {
  const database = await getDatabase();
  const foodsCollection = database.collection<FoodDocument>("foods");

  const documentToInsert: NewFoodDocument = {
    userId: input.userId,
    name: input.name,
    calories: input.calories,
    servingSize: input.servingSize,
    brand: input.brand,
    notes: input.notes,
  };

  const result = await foodsCollection.insertOne(documentToInsert);
  const createdFood = await foodsCollection.findOne({ _id: result.insertedId });

  if (!createdFood) {
    throw new Error("Failed to load the created food.");
  }

  return mapFoodDocument(createdFood);
}
