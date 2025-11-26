import pino from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.LOG_LEVEL ?? "info",
  transport: config.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
  redact: ["req.headers.authorization", "req.headers.cookie", "res.headers"],
  base: {
    app: config.APP_NAME
  }
});

