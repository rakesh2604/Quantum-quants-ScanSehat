import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAccessLog extends Document {
  tenant: Types.ObjectId;
  patient: Types.ObjectId;
  doctorEmail: string;
  action: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const accessLogSchema = new Schema<IAccessLog>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorEmail: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

accessLogSchema.index({ tenant: 1, patient: 1, createdAt: -1 });

export const AccessLog = mongoose.model<IAccessLog>("AccessLog", accessLogSchema);
