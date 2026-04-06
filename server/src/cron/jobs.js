import cron from "node-cron";
import { cronService } from "../services/cronService.js";

const safeRun = async (label, runner) => {
  try {
    const count = await runner();
    console.log(`[cron] ${label}: ${count}`);
  } catch (error) {
    console.error(`[cron] ${label} failed`, error);
  }
};

export const startCronJobs = () => {
  cron.schedule("0 * * * *", async () => {
    await safeRun("publish_scheduled_ads", () => cronService.publishScheduledAds());
  });

  cron.schedule("0 0 * * *", async () => {
    await safeRun("expire_ads", () => cronService.expireAds());
  });
};
