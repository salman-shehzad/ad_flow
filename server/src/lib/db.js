import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

const normalizeDatabaseUrl = (value) => {
  if (!value) {
    return value;
  }

  try {
    return new URL(value).toString();
  } catch {
    const protocolIndex = value.indexOf("://");
    const atIndex = value.lastIndexOf("@");

    if (protocolIndex === -1 || atIndex === -1) {
      return value;
    }

    const credentials = value.slice(protocolIndex + 3, atIndex);
    const separatorIndex = credentials.indexOf(":");

    if (separatorIndex === -1) {
      return value;
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    return `${value.slice(0, protocolIndex + 3)}${username}:${encodeURIComponent(password)}${value.slice(atIndex)}`;
  }
};

const databaseUrl = normalizeDatabaseUrl(env.databaseUrl);
const ssl =
  databaseUrl && databaseUrl.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl,
});

export const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};

export default pool;
