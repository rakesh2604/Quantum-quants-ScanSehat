import crypto from "crypto";
import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { doubleCsrf } from "csrf-csrf";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import pinoHttp from "pino-http";
import authRoutes from "./routes/authRoutes";
import recordRoutes from "./routes/recordRoutes";
import accessRoutes from "./routes/accessRoutes";
import aiRoutes from "./routes/aiRoutes";
import searchRoutes from "./routes/searchRoutes";
import logsRoutes from "./routes/logRoutes";
import billingRoutes from "./routes/billingRoutes";
import tenantRoutes from "./routes/tenantRoutes";
import adminRoutes from "./routes/adminRoutes";
import { config } from "./config";
import { logger } from "./utils/logger";
import { stripeWebhook } from "./controllers/billingController";

const app = express();

const allowedOrigins = config.FRONTEND_URL.split(",").map((origin) => origin.trim());
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      logger.debug("CORS: Allowing request with no origin");
      return callback(null, true);
    }
    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      logger.debug({ origin }, "CORS: Allowing exact match");
      return callback(null, true);
    }
    // In development, also allow localhost variations
    if (config.NODE_ENV === "development") {
      if (origin.includes("localhost") || origin.includes("127.0.0.1") || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
        logger.debug({ origin }, "CORS: Allowing localhost in development");
        return callback(null, true);
      }
    }
    logger.warn({ origin, allowedOrigins }, "CORS: Origin not allowed");
    return callback(new Error(`Origin ${origin} not allowed by CORS. Allowed: ${allowedOrigins.join(", ")}`));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With", "Accept"],
  exposedHeaders: ["X-Request-Id"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  maxAge: 86400 // 24 hours
};

app.use(
  pinoHttp({
    logger,
    customLogLevel: (_, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    }
  })
);

// Health check endpoint - must be before middleware that modifies req.query
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: Date.now() }));

// Express 5 compatibility: Make req.query writable to allow middleware modifications
app.use((req, res, next) => {
  // Redefine req.query as writable to fix "Cannot set property query" error in Express 5
  if (req.query && typeof req.query === 'object') {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});

app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
// Apply CORS before other middleware
app.use(cors(corsOptions));

app.post("/api/billing/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(
  express.json({
    limit: `${config.MAX_FILE_MB}mb`
  })
);
// Only parse URL-encoded bodies, not query strings
app.use(express.urlencoded({ extended: false, limit: `${config.MAX_FILE_MB}mb` }));
app.use(cookieParser());


// Skip hpp() and mongoSanitize() for Express 5 compatibility
// They try to modify req.query which is read-only in Express 5
// TODO: Find Express 5-compatible alternatives or update middleware
// app.use(hpp()); // Disabled - causes "Cannot set property query" error
// app.use(mongoSanitize()); // Disabled - may cause issues with Express 5

// Alternative: Only sanitize req.body (not req.query)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Basic sanitization - remove $ and . from keys (mongodb operators)
    const sanitize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          const cleanKey = key.replace(/[$\.]/g, '');
          sanitized[cleanKey] = sanitize(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };
    req.body = sanitize(req.body);
  }
  next();
});

app.use(xss());
app.use(compression());

app.use(
  rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    limit: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ message: "Too many requests" })
  })
);

// CSRF protection using csrf-csrf (Express 5 compatible)
const { generateToken, validateRequest } = doubleCsrf({
  getSecret: () => config.CSRF_SECRET || crypto.randomBytes(32).toString("hex"),
  cookieName: "__Host-psifi.xsrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: config.NODE_ENV === "production"
  },
  getTokenFromRequest: (req) => {
    return req.body?._csrf || req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];
  }
});

// CSRF token endpoint
app.get("/api/security/csrf-token", (req, res) => {
  const token = generateToken(req, res);
  res.json({ token });
});

// Apply CSRF protection to all state-changing routes (skip GET, HEAD, OPTIONS)
// Also skip webhook endpoints and public auth endpoints
app.use((req, res, next) => {
  // Skip CSRF for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  // Skip CSRF for webhook endpoints (they use their own verification)
  if (req.path.includes("/webhook")) {
    return next();
  }
  // Skip CSRF for public auth endpoints (login, register, etc.)
  if (req.path.startsWith("/api/auth/google") || req.path.startsWith("/api/auth/forgot-password") || req.path.startsWith("/api/auth/reset-password")) {
    return next();
  }
  return validateRequest(req, res, next);
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Handle Express 5 query modification errors gracefully
  if (err?.message?.includes("Cannot set property query")) {
    logger.warn({ path: req.path, requestId: req.id }, "Express 5 compatibility issue with query parsing");
    // Try to continue the request by retrying without query modifications
    return res.status(500).json({ 
      message: "Server configuration error. Please check backend logs.", 
      requestId: req.id,
      error: "EXPRESS_5_COMPATIBILITY"
    });
  }
  
  logger.error({ err, path: req.path, requestId: req.id }, "Unhandled error");
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Unexpected error", requestId: req.id });
});

export default app;
