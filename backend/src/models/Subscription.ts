import mongoose, { Schema, Document, Types } from "mongoose";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface ISubscription extends Document {
  tenant: Types.ObjectId;
  plan: "free" | "pro" | "enterprise";
  status: SubscriptionStatus;
  seats: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd?: boolean;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    status: { type: String, enum: ["trialing", "active", "past_due", "canceled"], default: "trialing" },
    seats: { type: Number, default: 5 },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
    trialEndsAt: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

subscriptionSchema.index({ tenant: 1 }, { unique: true });

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

