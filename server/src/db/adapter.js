import { db } from "../config/db.js";

export const sqlAdapter = {
  query(text, params) {
    return db.query(text, params);
  },
  async transaction(work) {
    const client = await db.getClient();
    try {
      await client.query("BEGIN");
      const scoped = {
        query: (text, params) => client.query(text, params),
      };
      const result = await work(scoped);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
