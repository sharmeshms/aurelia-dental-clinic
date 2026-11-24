import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { contentDir, env } from "../config/env.js";
import { count, insert, replaceAll } from "../db/repo.js";

const contentCollections = [
  { name: "services", file: "services.json", idOf: (item) => item.slug },
  { name: "doctors", file: "doctors.json", idOf: (item) => item.slug },
  { name: "posts", file: "posts.json", idOf: (item) => item.slug },
  { name: "gallery", file: "gallery.json", idOf: (item) => item.id },
];

async function readContent(file) {
  const raw = await fs.readFile(path.join(contentDir, file), "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array`);
  return parsed;
}

export async function ensureSeed({ force = false } = {}) {
  if (env.seedDemoContent) {
    for (const collection of contentCollections) {
      const existing = await count(collection.name);
      if (existing > 0 && !force) continue;
      const items = await readContent(collection.file);
      const now = new Date().toISOString();
      const docs = items.map((item, index) => ({
        ...item,
        id: collection.idOf(item),
        order: index,
        createdAt: now,
        updatedAt: now,
      }));
      await replaceAll(collection.name, docs);
      console.log(`[seed] Loaded ${docs.length} ${collection.name}.`);
    }
  }

  const users = await count("users");
  if (users === 0) {
    const passwordHash = await bcrypt.hash(env.admin.password, 12);
    await insert("users", {
      id: crypto.randomUUID(),
      name: env.admin.name,
      email: env.admin.email,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    console.log(`[seed] Created admin account for ${env.admin.email}.`);
  }
}
