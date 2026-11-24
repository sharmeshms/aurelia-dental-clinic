import fs from "node:fs/promises";
import path from "node:path";
import { dataDir } from "../config/env.js";

/**
 * A tiny persistent JSON store used when MongoDB is not configured or cannot
 * be reached. It keeps the whole API functional in local development and on
 * demo deployments without a database, while MongoDB remains the recommended
 * production backend.
 */

const file = path.join(dataDir, "db.json");
const emptyState = () => ({ collections: {} });

let state = null;
let chain = Promise.resolve();

async function ensureLoaded() {
  if (state) return;
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    state = parsed && typeof parsed === "object" ? parsed : emptyState();
    state.collections ??= {};
  } catch {
    state = emptyState();
  }
}

async function persist() {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(state, null, 2), "utf8");
  await fs.rename(tmp, file);
}

function mutate(mutator) {
  const run = chain.then(async () => {
    await ensureLoaded();
    const result = await mutator(state);
    await persist();
    return result;
  });
  // Keep the queue alive even if one operation fails.
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function collection(stateRef, name) {
  stateRef.collections[name] ??= [];
  return stateRef.collections[name];
}

export async function jsonAll(name) {
  await ensureLoaded();
  return [...(state.collections[name] ?? [])];
}

export async function jsonFind(name, predicate) {
  const items = await jsonAll(name);
  return items.filter(predicate);
}

export async function jsonInsert(name, doc) {
  return mutate((current) => {
    const items = collection(current, name);
    items.push(doc);
    return doc;
  });
}

export async function jsonUpdate(name, id, patch) {
  return mutate((current) => {
    const items = collection(current, name);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...patch, id, updatedAt: new Date().toISOString() };
    return items[index];
  });
}

export async function jsonRemove(name, id) {
  return mutate((current) => {
    const items = collection(current, name);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  });
}

export async function jsonReplace(name, docs) {
  return mutate((current) => {
    current.collections[name] = docs;
    return docs.length;
  });
}

export async function jsonCount(name) {
  const items = await jsonAll(name);
  return items.length;
}
