import { config } from "../config";
import { logger } from "../utils/logger";

const frontendBase = config.FRONTEND_URL.split(",")[0];

export const sendEmail = async (params: { to: string; subject: string; html: string }) => {
  logger.info({ to: params.to, subject: params.subject }, "Email dispatched (stub)");
  // Production note: wire up SES, Resend, or SendGrid here.
  return Promise.resolve();
};

export const buildVerificationLink = (token: string) => `${frontendBase}/verify-email?token=${token}`;
export const buildResetLink = (token: string) => `${frontendBase}/reset-password?token=${token}`;

export const sendVerificationEmail = async (to: string, token: string) =>
  sendEmail({
    to,
    subject: "Verify your Scan Sehat email",
    html: `<p>Welcome to ${config.APP_NAME}. Confirm your email to activate secure sharing.</p><p><a href="${buildVerificationLink(
      token
    )}">Verify Email</a></p>`
  });

export const sendPasswordResetEmail = async (to: string, token: string) =>
  sendEmail({
    to,
    subject: "Reset your Scan Sehat password",
    html: `<p>Reset your password securely within 15 minutes.</p><p><a href="${buildResetLink(token)}">Create new password</a></p>`
  });

