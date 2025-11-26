import dotenv from "dotenv";
import path from "path";

// Load .env file - try multiple paths
const rootEnvPath = path.resolve(process.cwd(), ".env");
const parentEnvPath = path.resolve(process.cwd(), "..", ".env");

// Try current directory first, then parent directory
let result = dotenv.config({ path: rootEnvPath });
if (result.error) {
  result = dotenv.config({ path: parentEnvPath });
}

if (result.error) {
  console.error(`Error: Could not load .env file`);
  console.error(`Tried: ${rootEnvPath}`);
  console.error(`Tried: ${parentEnvPath}`);
  console.error("Make sure backend/.env exists with all required variables");
  process.exit(1);
}

type ConfigShape = {
  APP_NAME: string;
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  REFRESH_SECRET: string;
  REFRESH_EXPIRY: string;
  SESSION_COOKIE_NAME: string;
  REFRESH_COOKIE_NAME: string;
  CSRF_SECRET: string;
  CLOUDINARY_CLOUD: string;
  CLOUDINARY_KEY: string;
  CLOUDINARY_SECRET: string;
  OPENAI_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  STRIPE_SECRET_KEY: string; // Optional - empty string if not provided
  STRIPE_WEBHOOK_SECRET: string; // Optional - empty string if not provided
  STRIPE_PRICE_PRO_MONTH: string; // Optional - empty string if not provided
  STRIPE_PRICE_ENTERPRISE: string; // Optional - empty string if not provided
  FRONTEND_URL: string;
  OTP_EXPIRY_MIN: number;
  SESSION_TTL_MIN: number;
  MAX_FILE_MB: number;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;
  SENTRY_DSN: string;
  LOG_LEVEL: string;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  // Trim whitespace and validate
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Environment variable ${key} is empty`);
  }
  return trimmed;
};

const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] ?? defaultValue ?? "";
};

export const config: ConfigShape = {
  APP_NAME: requireEnv("APP_NAME"),
  NODE_ENV: requireEnv("NODE_ENV"),
  PORT: Number(requireEnv("PORT")),
  MONGO_URI: requireEnv("MONGO_URI"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRY: requireEnv("JWT_EXPIRY"),
  REFRESH_SECRET: requireEnv("REFRESH_SECRET"),
  REFRESH_EXPIRY: requireEnv("REFRESH_EXPIRY"),
  SESSION_COOKIE_NAME: requireEnv("SESSION_COOKIE_NAME"),
  REFRESH_COOKIE_NAME: requireEnv("REFRESH_COOKIE_NAME"),
  CSRF_SECRET: requireEnv("CSRF_SECRET"),
  CLOUDINARY_CLOUD: requireEnv("CLOUDINARY_CLOUD"),
  CLOUDINARY_KEY: requireEnv("CLOUDINARY_KEY"),
  CLOUDINARY_SECRET: requireEnv("CLOUDINARY_SECRET"),
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: requireEnv("GOOGLE_REDIRECT_URI"),
  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY", ""),
  STRIPE_WEBHOOK_SECRET: getEnv("STRIPE_WEBHOOK_SECRET", ""),
  STRIPE_PRICE_PRO_MONTH: getEnv("STRIPE_PRICE_PRO_MONTH", ""),
  STRIPE_PRICE_ENTERPRISE: getEnv("STRIPE_PRICE_ENTERPRISE", ""),
  FRONTEND_URL: requireEnv("FRONTEND_URL"),
  OTP_EXPIRY_MIN: Number(requireEnv("OTP_EXPIRY_MIN")),
  SESSION_TTL_MIN: Number(requireEnv("SESSION_TTL_MIN")),
  MAX_FILE_MB: Number(requireEnv("MAX_FILE_MB")),
  RATE_LIMIT_MAX: Number(requireEnv("RATE_LIMIT_MAX")),
  RATE_LIMIT_WINDOW_MS: Number(requireEnv("RATE_LIMIT_WINDOW_MS")),
  SENTRY_DSN: getEnv("SENTRY_DSN"),
  LOG_LEVEL: requireEnv("LOG_LEVEL")
};
