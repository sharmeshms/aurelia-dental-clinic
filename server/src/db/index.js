import mongoose from "mongoose";
import { env } from "../config/env.js";

let mode = "json";

export function dbMode() {
  return mode;
}

export async function connectDatabase() {
  if (!env.mongoUri) {
    mode = "json";
    console.warn(
      "[db] MONGODB_URI is not set — using the local JSON fallback store (server/data/db.json).",
    );
    return mode;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    mode = "mongo";
    console.log("[db] Connected to MongoDB.");
  } catch (error) {
    mode = "json";
    console.error(
      `[db] MongoDB connection failed (${error.message}). Falling back to the JSON store.`,
    );
  }
  return mode;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
