import mongoose, { Schema, Document } from "mongoose";

export type TenantPlan = "free" | "pro" | "enterprise";
export type TenantStatus = "trialing" | "active" | "suspended";

export interface ITenant extends Document {
  name: string;
  slug: string;
  industry?: string;
  primaryContact: string;
  contactEmail: string;
  plan: TenantPlan;
  status: TenantStatus;
  address?: string;
  metadata?: Record<string, unknown>;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    industry: { type: String },
    primaryContact: { type: String, required: true },
    contactEmail: { type: String, required: true },
    address: { type: String },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    status: { type: String, enum: ["trialing", "active", "suspended"], default: "trialing" },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ plan: 1, status: 1 });

export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);

