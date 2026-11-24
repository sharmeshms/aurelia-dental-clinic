import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** server/ */
export const serverRoot = path.resolve(here, "..", "..");
/** repository root (contains client/, server/, content/) */
export const projectRoot = path.resolve(serverRoot, "..");
export const contentDir = path.join(projectRoot, "content");
export const dataDir = path.join(serverRoot, "data");

const isProd = process.env.NODE_ENV === "production";

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_SECRET = "aurelia-development-secret-change-me";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd,
  port: number(process.env.PORT, 4000),
  mongoUri: (process.env.MONGODB_URI ?? "").trim(),
  jwtSecret: (process.env.JWT_SECRET ?? "").trim() || DEFAULT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientOrigin: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173").replace(/\/$/, ""),
  cookieName: process.env.COOKIE_NAME ?? "aurelia_session",
  admin: {
    email: (process.env.ADMIN_EMAIL ?? "admin@aureliadental.studio").toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "Admin@12345",
    name: process.env.ADMIN_NAME ?? "Practice Manager",
  },
  seedDemoContent: process.env.SEED_DEMO_CONTENT !== "false",
};

export const usingDefaultSecret = env.jwtSecret === DEFAULT_SECRET;
export const usingDefaultAdminPassword = env.admin.password === "Admin@12345";

if (isProd && usingDefaultSecret) {
  throw new Error(
    "Refusing to start in production with the default JWT_SECRET. Set JWT_SECRET to a long random value.",
  );
}
