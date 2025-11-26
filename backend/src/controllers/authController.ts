import crypto from "crypto";
import { Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Tenant } from "../models/Tenant";
import { Subscription } from "../models/Subscription";
import { UserSession } from "../models/UserSession";
import { VerificationToken } from "../models/VerificationToken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/generateTokens";
import { expiryToMs } from "../utils/time";
import { sha256 } from "../utils/hash";
import { slugify } from "../utils/slugify";
import { config } from "../config";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/emailService";
import { AuthenticatedRequest } from "../middleware/auth";
import { logger } from "../utils/logger";
import { buildGoogleAuthUrl, exchangeCodeForProfile } from "../services/googleOAuth";
import multer from "multer";
import { uploadBuffer } from "../services/cloudinary";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["patient", "doctor", "admin"]).default("patient"),
  tenantSlug: z.string().optional(),
  tenantName: z.string().optional(),
  industry: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const emailSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8)
});

const cookieBase = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: config.NODE_ENV === "production",
  path: "/"
};

const accessCookieOptions = {
  ...cookieBase,
  maxAge: expiryToMs(config.JWT_EXPIRY)
};

const refreshCookieOptions = {
  ...cookieBase,
  maxAge: expiryToMs(config.REFRESH_EXPIRY)
};

const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  tenant: user.tenant,
  emailVerified: user.emailVerified,
  avatarUrl: user.avatarUrl
});

const createTenantIfNeeded = async (tenantSlug?: string, tenantName?: string, industry?: string) => {
  if (tenantSlug) {
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    return tenant;
  }
  if (!tenantName) {
    throw new Error("Tenant name is required for new organisations");
  }
  const slug = slugify(tenantName);
  const tenant = await Tenant.create({
    name: tenantName,
    slug,
    industry,
    primaryContact: tenantName,
    contactEmail: `admin@${slug}.example.com`,
    plan: "free"
  });
  await Subscription.create({ tenant: tenant.id, plan: "free", status: "trialing" });
  return tenant;
};

const createVerificationToken = async (userId: string, purpose: "email-verify" | "password-reset") => {
  const token = crypto.randomBytes(32).toString("hex");
  await VerificationToken.create({
    user: userId,
    purpose,
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
  });
  return token;
};

const issueSession = async (user: any, res: Response, meta: { userAgent?: string; ip?: string }) => {
  const payload = { sub: user.id, role: user.role, tenant: user.tenant.toString() };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  await UserSession.create({
    user: user.id,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(Date.now() + expiryToMs(config.REFRESH_EXPIRY)),
    userAgent: meta.userAgent,
    ip: meta.ip
  });
  res.cookie(config.SESSION_COOKIE_NAME, accessToken, accessCookieOptions);
  res.cookie(config.REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return { accessToken, refreshToken };
};

const clearSessionCookies = (res: Response) => {
  res.clearCookie(config.SESSION_COOKIE_NAME, cookieBase);
  res.clearCookie(config.REFRESH_COOKIE_NAME, cookieBase);
};

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const { name, email, password, role, tenantSlug, tenantName, industry } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Account already exists" });
  }
  let tenant;
  try {
    tenant = await createTenantIfNeeded(tenantSlug, tenantName ?? name, industry);
  } catch (error: any) {
    if (error.message === "Tenant not found") {
      return res.status(404).json({ message: "Tenant not found" });
    }
    throw error;
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    tenant: tenant.id,
    emailVerified: false
  });
  const token = await createVerificationToken(user.id, "email-verify");
  await sendVerificationEmail(user.email, token);
  res.status(201).json({ message: "Account created. Please verify your email." });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.emailVerified) {
    return res.status(403).json({ message: "Verify your email to continue" });
  }
  const sessionResult = await issueSession(user, res, { userAgent: req.get("user-agent") ?? "", ip: req.ip });
  user.lastLoginAt = new Date();
  await user.save();
  res.json({ token: sessionResult.accessToken, user: sanitizeUser(user) });
};

export const refreshSession = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[config.REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }
    const payload = verifyRefreshToken(token);
    const session = await UserSession.findOne({ user: payload.sub, tokenHash: sha256(token) });
    if (!session) {
      clearSessionCookies(res);
      return res.status(401).json({ message: "Session expired" });
    }
    await session.deleteOne();
    const user = await User.findById(payload.sub);
    if (!user) {
      clearSessionCookies(res);
      return res.status(401).json({ message: "User not found" });
    }
    await issueSession(user, res, { userAgent: req.get("user-agent") ?? "", ip: req.ip });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    logger.warn({ error }, "Failed to refresh session");
    clearSessionCookies(res);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[config.REFRESH_COOKIE_NAME];
  if (token) {
    await UserSession.deleteOne({ tokenHash: sha256(token) });
  }
  clearSessionCookies(res);
  res.json({ message: "Logged out" });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = (req.query.token ?? req.body.token) as string | undefined;
  if (!token) {
    return res.status(400).json({ message: "Verification token missing" });
  }
  const lookup = await VerificationToken.findOne({ tokenHash: sha256(token), purpose: "email-verify" });
  if (!lookup) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }
  const user = await User.findById(lookup.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.emailVerified = true;
  await user.save();
  lookup.consumedAt = new Date();
  await lookup.save();
  res.json({ message: "Email verified" });
};

export const resendVerification = async (req: Request, res: Response) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const user = await User.findOne({ email: parsed.data.email });
  if (!user) {
    return res.status(200).json({ message: "If the account exists, an email was sent" });
  }
  const token = await createVerificationToken(user.id, "email-verify");
  await sendVerificationEmail(user.email, token);
  res.json({ message: "Verification email sent" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const user = await User.findOne({ email: parsed.data.email });
  if (user) {
    const token = await createVerificationToken(user.id, "password-reset");
    await sendPasswordResetEmail(user.email, token);
  }
  res.json({ message: "If the account exists, reset instructions were sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const { token, password } = parsed.data;
  const lookup = await VerificationToken.findOne({ tokenHash: sha256(token), purpose: "password-reset" });
  if (!lookup) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }
  const user = await User.findById(lookup.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.password = password;
  user.security = {
    otpEnabled: user.security?.otpEnabled ?? false,
    lastPasswordResetAt: new Date()
  };
  await user.save();
  lookup.consumedAt = new Date();
  await lookup.save();
  res.json({ message: "Password updated" });
};

export const sessionProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  res.json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const { name, phone, organisation, avatarUrl } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (organisation !== undefined) user.organisation = organisation;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  
  await user.save();
  res.json({ user: sanitizeUser(user) });
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required" });
  }
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  
  user.password = newPassword;
  user.security = {
    otpEnabled: user.security?.otpEnabled ?? false,
    lastPasswordResetAt: new Date()
  };
  await user.save();
  res.json({ message: "Password updated successfully" });
};

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  
  const uploadResult = await uploadBuffer(req.file.buffer, "avatars", req.file.originalname);
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  user.avatarUrl = uploadResult.secure_url;
  await user.save();
  res.json({ avatarUrl: uploadResult.secure_url, user: sanitizeUser(user) });
};

export const beginGoogleOAuth = async (req: Request, res: Response) => {
  try {
    // Check if Google OAuth is configured
    if (!config.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID === "google-client-id.apps.googleusercontent.com") {
      return res.status(500).json({ message: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your config file." });
    }
    
    const nonce = crypto.randomUUID();
    const tenantSlug = (req.query.tenantSlug as string) ?? "";
    // Use 'lax' sameSite for OAuth cookies to allow cross-site redirects from Google
    const oauthCookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: config.NODE_ENV === "production",
      path: "/",
      maxAge: 5 * 60 * 1000 // 5 minutes
    };
    res.cookie("scan_sehat_oauth_state", nonce, oauthCookieOptions);
    res.cookie("scan_sehat_oauth_tenant", tenantSlug, oauthCookieOptions);
    const url = buildGoogleAuthUrl(nonce);
    res.json({ url });
  } catch (error: any) {
    logger.error({ error }, "Failed to start Google OAuth");
    res.status(500).json({ message: error.message || "Failed to start Google login" });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    // Check MongoDB connection before processing
    if (mongoose.connection.readyState !== 1) {
      logger.error({ readyState: mongoose.connection.readyState }, "MongoDB not connected during OAuth callback");
      const frontendUrl = config.FRONTEND_URL.split(",")[0];
      return res.redirect(`${frontendUrl}/auth/google/callback?status=error&reason=database_error`);
    }
    
    const storedState = req.cookies?.scan_sehat_oauth_state;
    const queryState = req.query.state as string | undefined;
    
    // Enhanced logging for debugging
    if (!storedState || !queryState) {
      logger.warn({ 
        hasStoredState: !!storedState, 
        hasQueryState: !!queryState,
        cookies: Object.keys(req.cookies || {}),
        query: Object.keys(req.query || {})
      }, "OAuth state mismatch: missing state");
      return res.redirect(`${config.FRONTEND_URL.split(",")[0]}/auth/google/callback?status=error&reason=state_mismatch`);
    }
    
    if (storedState !== queryState) {
      logger.warn({ 
        storedStateLength: storedState.length,
        queryStateLength: queryState.length,
        statesMatch: storedState === queryState
      }, "OAuth state mismatch: states do not match");
      return res.redirect(`${config.FRONTEND_URL.split(",")[0]}/auth/google/callback?status=error&reason=state_mismatch`);
    }
    
    const code = req.query.code as string | undefined;
    if (!code) {
      return res.redirect(`${config.FRONTEND_URL.split(",")[0]}/auth/google/callback?status=error&reason=missing_code`);
    }
    const profile = await exchangeCodeForProfile(code);
    if (!profile?.email) {
      return res.redirect(`${config.FRONTEND_URL.split(",")[0]}/auth/google/callback?status=error&reason=no_email`);
    }
    let user = await User.findOne({ email: profile.email });
    const tenantSlug = (req.cookies?.scan_sehat_oauth_tenant as string | undefined) || slugify(profile.email);
    if (!user) {
      const tenant = await createTenantIfNeeded(
        tenantSlug || undefined,
        profile.hd ?? profile.given_name ?? profile.email,
        profile.family_name
      );
      user = await User.create({
        name: `${profile.given_name ?? ""} ${profile.family_name ?? ""}`.trim() || profile.email,
        email: profile.email,
        password: crypto.randomBytes(16).toString("hex"),
        role: "patient",
        tenant: tenant.id,
        emailVerified: true,
        googleId: profile.sub,
        avatarUrl: profile.picture
      });
    } else if (!user.googleId) {
      user.googleId = profile.sub;
      user.emailVerified = true;
      user.avatarUrl = profile.picture ?? user.avatarUrl;
      await user.save();
    }
    const sessionResult = await issueSession(user, res, { userAgent: req.get("user-agent") ?? "", ip: req.ip });
    // Clear OAuth cookies with same options used to set them (lax sameSite)
    const oauthCookieClearOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: config.NODE_ENV === "production",
      path: "/"
    };
    res.clearCookie("scan_sehat_oauth_state", oauthCookieClearOptions);
    res.clearCookie("scan_sehat_oauth_tenant", oauthCookieClearOptions);
    
    // Return token and user in redirect URL for frontend to initialize session
    const sanitizedUser = sanitizeUser(user);
    // Ensure all fields are present and valid
    const userData = {
      id: sanitizedUser.id || user.id,
      name: sanitizedUser.name || user.name || "",
      email: sanitizedUser.email || user.email || "",
      role: sanitizedUser.role || user.role || "patient",
      tenant: sanitizedUser.tenant || user.tenant?.toString() || "",
      emailVerified: sanitizedUser.emailVerified !== undefined ? sanitizedUser.emailVerified : true,
      avatarUrl: sanitizedUser.avatarUrl || user.avatarUrl || undefined
    };
    const userJson = JSON.stringify(userData);
    const userBase64 = Buffer.from(userJson, "utf8").toString("base64");
    const frontendUrl = config.FRONTEND_URL.split(",")[0];
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(sessionResult.accessToken)}&user=${encodeURIComponent(userBase64)}`;
    res.redirect(redirectUrl);
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const errorName = error?.name || "";
    const errorStack = error?.stack || "";
    
    logger.error({ 
      error, 
      message: errorMessage, 
      name: errorName,
      stack: errorStack,
      code: error?.code,
      errno: error?.errno
    }, "Google OAuth callback failed");
    
    // Determine specific error reason with better detection
    let reason = "server";
    
    // Check for MongoDB/database errors
    if (errorMessage?.includes("Mongo") || 
        errorMessage?.includes("connection") || 
        errorMessage?.includes("Mongoose") ||
        errorName === "MongoError" ||
        errorName === "MongooseError" ||
        error?.code === "ECONNREFUSED" ||
        errorMessage?.includes("ENOTFOUND") ||
        errorMessage?.includes("querySrv")) {
      reason = "database_error";
    } 
    // Check for Google OAuth errors
    else if (errorMessage?.includes("Google") || 
             errorMessage?.includes("OAuth") ||
             errorMessage?.includes("credentials") ||
             errorMessage?.includes("token") ||
             errorName === "OAuth2Error") {
      reason = "google_auth_failed";
    } 
    // Check for tenant errors
    else if (errorMessage?.includes("Tenant") || 
             errorMessage?.includes("tenant")) {
      reason = "tenant_error";
    } 
    // Check for user creation/update errors
    else if (errorMessage?.includes("User") || 
             errorMessage?.includes("user") ||
             errorMessage?.includes("validation") ||
             errorName === "ValidationError") {
      reason = "user_creation_failed";
    }
    
    const frontendUrl = config.FRONTEND_URL.split(",")[0];
    res.redirect(`${frontendUrl}/auth/google/callback?status=error&reason=${reason}`);
  }
};
