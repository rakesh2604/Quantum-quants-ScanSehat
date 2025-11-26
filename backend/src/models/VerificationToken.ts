import mongoose, { Schema, Document, Types } from "mongoose";

export type TokenPurpose = "email-verify" | "password-reset";

export interface IVerificationToken extends Document {
  user: Types.ObjectId;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  consumedAt?: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purpose: { type: String, enum: ["email-verify", "password-reset"], required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date }
  },
  { timestamps: true }
);

verificationTokenSchema.index({ tokenHash: 1, purpose: 1 }, { unique: true });
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken = mongoose.model<IVerificationToken>("VerificationToken", verificationTokenSchema);

