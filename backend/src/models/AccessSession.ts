import mongoose, { Schema, Document, Types } from "mongoose";

export type AccessChannel = "otp" | "qr";
export type AccessStatus = "pending" | "redeemed" | "expired";

export interface IAccessSession extends Document {
  tenant: Types.ObjectId;
  patient: Types.ObjectId;
  doctorEmail: string;
  channel: AccessChannel;
  otpHash?: string;
  qrHash?: string;
  sessionToken: string;
  expiresAt: Date;
  redeemedAt?: Date;
  status: AccessStatus;
  ephemeralKey: string;
}

const accessSessionSchema = new Schema<IAccessSession>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorEmail: { type: String, required: true },
    channel: { type: String, enum: ["otp", "qr"], required: true },
    otpHash: { type: String },
    qrHash: { type: String },
    sessionToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    redeemedAt: { type: Date },
    status: { type: String, enum: ["pending", "redeemed", "expired"], default: "pending" },
    ephemeralKey: { type: String, required: true }
  },
  { timestamps: true }
);

accessSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
accessSessionSchema.index({ tenant: 1, status: 1 });

export const AccessSession = mongoose.model<IAccessSession>("AccessSession", accessSessionSchema);
