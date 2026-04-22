import { app } from "../server/src/app.js";
import { initializeDatabase } from "../server/src/db/init.js";
import {
  markDatabaseReady,
  markDatabaseUnavailable,
} from "../server/src/lib/dbState.js";

let initializationPromise;

const ensureInitialized = async () => {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase()
      .then(() => {
        markDatabaseReady();
      })
      .catch((error) => {
        markDatabaseUnavailable(error);
        console.error("Database initialization failed in Vercel function.", error);
      });
  }

  await initializationPromise;
};

export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}
