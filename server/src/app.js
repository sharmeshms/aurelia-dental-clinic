import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { env, projectRoot } from "./config/env.js";
import { corsOptions } from "./middleware/cors.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/error.js";
import { notFound } from "./utils/http.js";
import contentRoutes from "./routes/content.js";
import formRoutes from "./routes/forms.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(cors(corsOptions()));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "aurelia-api",
      time: new Date().toISOString(),
    });
  });

  app.use("/api", apiLimiter);
  app.use("/api/auth", authRoutes);
  app.use("/api", contentRoutes);
  app.use("/api", formRoutes);
  app.use("/api/admin", adminRoutes);

  app.use("/api", notFound);

  // Serve the built client in production, with SPA fallback.
  const clientDist = path.join(projectRoot, "client", "dist");
  if (env.isProd && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { maxAge: "1h", index: false }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
