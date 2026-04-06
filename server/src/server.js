import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./db/init.js";
import { startCronJobs } from "./cron/jobs.js";

const start = async () => {
  await initializeDatabase();
  startCronJobs();

  app.listen(env.port, () => {
    console.log(`AdFlow Pro API listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
