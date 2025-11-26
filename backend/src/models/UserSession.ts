import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserSession extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  rotatedAt?: Date;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    expiresAt: { type: Date, required: true },
    rotatedAt: { type: Date }
  },
  { timestamps: true }
);

userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
userSessionSchema.index({ user: 1 });

export const UserSession = mongoose.model<IUserSession>("UserSession", userSessionSchema);

