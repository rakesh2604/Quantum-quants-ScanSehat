import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "patient" | "doctor" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  tenant: Types.ObjectId;
  organisation?: string;
  phone?: string;
  emailVerified: boolean;
  googleId?: string;
  avatarUrl?: string;
  lastLoginAt?: Date;
  security?: {
    otpEnabled: boolean;
    lastPasswordResetAt?: Date;
  };
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    organisation: { type: String },
    phone: { type: String },
    emailVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },
    lastLoginAt: { type: Date },
    security: {
      otpEnabled: { type: Boolean, default: false },
      lastPasswordResetAt: { type: Date }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
