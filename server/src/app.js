import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getDatabaseStatus } from "./lib/dbState.js";

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        env.allowedOrigins.length === 0 ||
        env.allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const database = getDatabaseStatus();

  res.status(database.ready ? 200 : 503).json({
    status: database.ready ? "ok" : "degraded",
    database,
  });
});

app.use((req, res, next) => {
  const database = getDatabaseStatus();

  if (database.ready) {
    return next();
  }

  return res.status(503).json({
    message:
      "Database is unavailable. Update DATABASE_URL to a reachable Supabase connection string and try again.",
    database,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/moderator", moderatorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.use(errorHandler);
