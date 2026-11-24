import { env } from "../config/env.js";

export function corsOptions() {
  const allowed = new Set([
    env.clientOrigin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
  ]);
  return {
    origin(origin, callback) {
      // Same-origin/server-to-server requests have no Origin header.
      if (!origin || allowed.has(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
