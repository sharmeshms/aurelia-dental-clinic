import { createApp } from "./app.js";
import { env, usingDefaultAdminPassword, usingDefaultSecret } from "./config/env.js";
import { connectDatabase, disconnectDatabase, dbMode } from "./db/index.js";
import { ensureSeed } from "./seed/ensure.js";

async function main() {
  await connectDatabase();
  await ensureSeed();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`\n  Aurelia API listening on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  Data store: ${dbMode() === "mongo" ? "MongoDB" : "JSON fallback (server/data/db.json)"}`);
    if (usingDefaultSecret) {
      console.warn("  ⚠ Using the development JWT secret. Set JWT_SECRET before deploying.");
    }
    if (usingDefaultAdminPassword) {
      console.warn(
        `  ⚠ Default admin credentials in use: ${env.admin.email} / ${env.admin.password} — change these.`,
      );
    }
    console.log("");
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received — shutting down.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((error) => {
  console.error("[api] Failed to start:", error);
  process.exit(1);
});
