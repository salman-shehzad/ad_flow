import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const serverEnvPath = path.resolve(currentDir, "../../.env");
const workspaceEnvPath = path.resolve(currentDir, "../../../.env");

dotenv.config({ path: workspaceEnvPath });
dotenv.config({ path: serverEnvPath, override: true });

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
};

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null,
]
  .flatMap((value) => (value ? value.split(",") : []))
  .map((value) => normalizeOrigin(value.trim()))
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  allowedOrigins,
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/adflow_pro",
};
