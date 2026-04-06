import { sqlAdapter } from "./adapter.js";
import { schemaSql } from "./schema.js";
import { seedDatabase } from "./seed.js";

export const initializeDatabase = async () => {
  await sqlAdapter.query(schemaSql);
  await seedDatabase(sqlAdapter);
};
