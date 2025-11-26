import mongoose, { Schema, Document, Types } from "mongoose";

export interface EncryptionBundle {
  ciphertext: string;
  iv: string;
  salt: string;
}

export type IntegrityBadge = "verified" | "patient-uploaded" | "low-quality" | "unknown";

/**
 * Structured medical data extracted by AI
 */
export interface StructuredMedicalData {
  diagnosis?: string;
  medications?: string[];
  labValues?: Record<string, string>;
  vitals?: Record<string, string>;
  doctorNotes?: string;
  allergies?: string[];
  doctorName?: string;
  recordType?: string;
}

export interface IMedicalRecord extends Document {
  tenant: Types.ObjectId;
  patient: Types.ObjectId;
  uploader: Types.ObjectId;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  encryption: EncryptionBundle;
  summary: string;
  metadata?: Record<string, unknown>;
  ocrText: string;
  embedding: number[];
  tags: string[];
  integrity: IntegrityBadge;
  /**
   * Structured AI-extracted medical data
   */
  structuredData?: StructuredMedicalData;
  createdAt: Date;
  updatedAt: Date;
}

const encryptionSchema = new Schema<EncryptionBundle>(
  {
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    salt: { type: String, required: true }
  },
  { _id: false }
);

const structuredDataSchema = new Schema<StructuredMedicalData>(
  {
    diagnosis: { type: String },
    medications: { type: [String], default: [] },
    labValues: { type: Schema.Types.Mixed },
    vitals: { type: Schema.Types.Mixed },
    doctorNotes: { type: String },
    allergies: { type: [String], default: [] },
    doctorName: { type: String },
    recordType: { type: String }
  },
  { _id: false }
);

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    encryption: { type: encryptionSchema, required: true },
    summary: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed },
    ocrText: { type: String, default: "" },
    embedding: { type: [Number], default: [] },
    tags: { type: [String], default: [] },
    integrity: { type: String, enum: ["verified", "patient-uploaded", "low-quality", "unknown"], default: "unknown" },
    structuredData: { type: structuredDataSchema }
  },
  { timestamps: true }
);

medicalRecordSchema.index({ embedding: "cosine" } as Record<string, any>);
medicalRecordSchema.index({ tenant: 1, patient: 1, createdAt: -1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>("MedicalRecord", medicalRecordSchema);
