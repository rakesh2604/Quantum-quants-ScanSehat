import crypto from "crypto";
import { EncryptionBundle } from "../models/MedicalRecord";

export const validateEncryptionBundle = (bundle: EncryptionBundle) => {
  if (!bundle?.ciphertext || !bundle.iv || !bundle.salt) {
    throw new Error("Invalid encryption payload: ciphertext, iv and salt are required");
  }
};

export const issueSessionToken = () => crypto.randomBytes(32).toString("hex");
