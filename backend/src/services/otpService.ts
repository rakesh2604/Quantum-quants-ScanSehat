import { config } from "../config";
import { sha256 } from "../utils/hash";

export type OTPBundle = {
  otp: string;
  hash: string;
  expiresAt: Date;
};

export const generateOTP = (): OTPBundle => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + config.OTP_EXPIRY_MIN * 60 * 1000);
  return { otp, hash: sha256(otp), expiresAt };
};

export const verifyOTP = (otp: string, hash: string) => sha256(otp) === hash;
