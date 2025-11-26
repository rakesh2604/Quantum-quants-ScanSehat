import { OAuth2Client } from "google-auth-library";
import { config } from "../config";
import { logger } from "../utils/logger";

const scopes = [
  "openid",
  "profile",
  "email"
];

const getOAuthClient = () => {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REDIRECT_URI) {
    const missing = [];
    if (!config.GOOGLE_CLIENT_ID) missing.push("GOOGLE_CLIENT_ID");
    if (!config.GOOGLE_CLIENT_SECRET) missing.push("GOOGLE_CLIENT_SECRET");
    if (!config.GOOGLE_REDIRECT_URI) missing.push("GOOGLE_REDIRECT_URI");
    throw new Error(`Google OAuth credentials are not configured. Missing: ${missing.join(", ")}`);
  }
  
  // Validate credentials are not placeholder values
  if (config.GOOGLE_CLIENT_ID.includes("google-client-id") || 
      config.GOOGLE_CLIENT_SECRET.includes("google-client-secret")) {
    throw new Error("Google OAuth credentials appear to be placeholder values. Please set real credentials in .env");
  }
  
  return new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI);
};

export const buildGoogleAuthUrl = (state: string) => {
  try {
    const oauthClient = getOAuthClient();
    return oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      state
    });
  } catch (error: any) {
    logger.error({ error }, "Failed to build Google auth URL");
    throw error;
  }
};

export const exchangeCodeForProfile = async (code: string) => {
  try {
    const oauthClient = getOAuthClient();
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);
    if (!tokens.id_token) {
      throw new Error("Missing Google ID token");
    }
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Failed to get user profile from Google");
    }
    return payload;
  } catch (error: any) {
    logger.error({ error }, "Failed to exchange Google OAuth code");
    throw error;
  }
};

