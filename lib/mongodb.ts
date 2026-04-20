import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

if (!dbName) {
  throw new Error("Missing MONGODB_DB_NAME environment variable.");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);

export const mongoClientPromise =
  global._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = mongoClientPromise;
}

export async function getDatabase() {
  const mongoClient = await mongoClientPromise;

  return mongoClient.db(dbName);
}
