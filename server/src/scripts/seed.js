import { connectDatabase, disconnectDatabase } from "../db/index.js";
import { ensureSeed } from "../seed/ensure.js";

async function run() {
  await connectDatabase();
  await ensureSeed({ force: process.argv.includes("--force") });
  console.log("[seed] Complete.");
  await disconnectDatabase();
  process.exit(0);
}

run().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
