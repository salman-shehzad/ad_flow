import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./db/init.js";
import { startCronJobs } from "./cron/jobs.js";
import {
  getDatabaseStatus,
  markDatabaseReady,
  markDatabaseUnavailable,
} from "./lib/dbState.js";

const start = async () => {
  try {
    await initializeDatabase();
    markDatabaseReady();
    startCronJobs();
  } catch (error) {
    markDatabaseUnavailable(error);
    console.error(
      "Database initialization failed. The API will start in degraded mode until DATABASE_URL points to a reachable Supabase host.",
    );
    console.error(error);
  }

  app.listen(env.port, () => {
    const databaseStatus = getDatabaseStatus();
    console.log(`AdFlow Pro API listening on port ${env.port}`);
    console.log(
      `Database status: ${databaseStatus.ready ? "ready" : "unavailable"}`,
    );
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
