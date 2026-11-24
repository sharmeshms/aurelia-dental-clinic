import mongoose from "mongoose";
import {
  jsonAll,
  jsonCount,
  jsonInsert,
  jsonRemove,
  jsonReplace,
  jsonUpdate,
} from "./store.js";

/**
 * Repository layer. Every document is addressed by a stable string `id`
 * (UUID, slug, or gallery id) so the same code works against MongoDB and the
 * JSON fallback store.
 */

const models = new Map();

function modelFor(name) {
  if (!models.has(name)) {
    const schema = new mongoose.Schema(
      {},
      { strict: false, timestamps: true, minimize: false, versionKey: false },
    );
    models.set(name, mongoose.models[name] ?? mongoose.model(name, schema));
  }
  return models.get(name);
}

export function isMongo() {
  return mongoose.connection.readyState === 1;
}

function serialize(doc) {
  if (!doc) return null;
  const value = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete value._id;
  delete value.__v;
  return value;
}

function matches(item, filter = {}) {
  return Object.entries(filter).every(([key, value]) => {
    if (value === undefined) return true;
    return item[key] === value;
  });
}

export async function list(name, filter = {}) {
  if (isMongo()) {
    const docs = await modelFor(name).find(filter).sort({ createdAt: -1 }).lean();
    return docs.map(serialize);
  }
  const items = await jsonAll(name);
  return items.filter((item) => matches(item, filter));
}

export async function findById(name, id) {
  if (!id) return null;
  if (isMongo()) {
    return serialize(await modelFor(name).findOne({ id }).lean());
  }
  const items = await jsonAll(name);
  return items.find((item) => item.id === id) ?? null;
}

export async function findOne(name, filter = {}) {
  if (isMongo()) {
    return serialize(await modelFor(name).findOne(filter).lean());
  }
  const items = await jsonAll(name);
  return items.find((item) => matches(item, filter)) ?? null;
}

export async function insert(name, doc) {
  const now = new Date().toISOString();
  const record = { ...doc, createdAt: doc.createdAt ?? now, updatedAt: now };
  if (isMongo()) {
    const created = await modelFor(name).create(record);
    return serialize(created);
  }
  return jsonInsert(name, record);
}

export async function update(name, id, patch) {
  const now = new Date().toISOString();
  const clean = { ...patch };
  delete clean.id;
  delete clean._id;
  if (isMongo()) {
    const doc = await modelFor(name).findOneAndUpdate(
      { id },
      { $set: { ...clean, updatedAt: now } },
      { new: true },
    );
    return serialize(doc);
  }
  return jsonUpdate(name, id, clean);
}

export async function remove(name, id) {
  if (isMongo()) {
    const result = await modelFor(name).deleteOne({ id });
    return result.deletedCount > 0;
  }
  return jsonRemove(name, id);
}

export async function count(name, filter = {}) {
  if (isMongo()) return modelFor(name).countDocuments(filter);
  const items = await jsonAll(name);
  return items.filter((item) => matches(item, filter)).length;
}

export async function replaceAll(name, docs) {
  if (isMongo()) {
    await modelFor(name).deleteMany({});
    if (docs.length) await modelFor(name).insertMany(docs);
    return docs.length;
  }
  return jsonReplace(name, docs);
}
