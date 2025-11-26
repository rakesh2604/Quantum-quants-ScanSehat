import { Response } from "express";
import { MedicalRecord, IntegrityBadge } from "../models/MedicalRecord";
import { uploadBuffer } from "../services/cloudinary";
import { summarizeText, extractStructuredDataFromImage, extractStructuredMedicalData } from "../services/openaiService";
import { runOCR } from "../services/ocrService";
import { buildEmbedding, cosineSimilarity } from "../services/embeddingService";
import { AuthenticatedRequest } from "../middleware/auth";
import { validateEncryptionBundle } from "../services/cryptoService";
import { config } from "../config";

export const uploadRecord = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const encryptionPayload = typeof req.body.encryption === "string" ? JSON.parse(req.body.encryption) : req.body.encryption;
  validateEncryptionBundle(encryptionPayload);

  const metadata = typeof req.body.metadata === "string" ? JSON.parse(req.body.metadata) : req.body.metadata || {};
  const providedEmbedding = typeof req.body.embedding === "string" ? JSON.parse(req.body.embedding) : req.body.embedding;
  const integrity: IntegrityBadge = req.body.integrity || metadata?.integrity || "unknown";
  if (!["verified", "patient-uploaded", "low-quality", "unknown"].includes(integrity)) {
    return res.status(400).json({ message: "Invalid integrity badge" });
  }

  const uploadResult = await uploadBuffer(req.file.buffer, "scan-sehat", req.file.originalname);
  const remoteUrl = uploadResult.secure_url;

  // Extract OCR text
  const ocrText = req.body.ocrText || metadata?.ocrText || (await runOCR(remoteUrl));
  
  // Extract structured medical data using AI
  let structuredData = metadata?.structuredData;
  if (!structuredData) {
    // Try image-based extraction first (for PDFs/images)
    if (req.file.mimetype.startsWith("image/") || req.file.mimetype === "application/pdf") {
      structuredData = await extractStructuredDataFromImage(remoteUrl);
    } else if (ocrText) {
      // Fallback to text-based extraction
      structuredData = await extractStructuredMedicalData(ocrText);
    }
  }

  // Generate summary
  const summary = req.body.summary || metadata?.summary || (await summarizeText(ocrText || req.body.notes || ""));
  
  // Build embedding for semantic search
  const embedding = providedEmbedding?.length ? providedEmbedding : await buildEmbedding(`${ocrText}\n${summary}`);

  const record = await MedicalRecord.create({
    tenant: req.user.tenant,
    patient: req.user._id,
    uploader: req.user._id,
    fileUrl: remoteUrl,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    encryption: encryptionPayload,
    summary,
    metadata,
    ocrText,
    embedding,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    integrity,
    structuredData
  });

  res.status(201).json({ record });
};

export const listRecords = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const records = await MedicalRecord.find({ tenant: req.user.tenant, patient: req.user._id }).sort({ createdAt: -1 });
  res.json({ records });
};

export const getRecord = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const record = await MedicalRecord.findOne({ _id: req.params.id, tenant: req.user.tenant, patient: req.user._id });
  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }
  res.json({ record });
};

export const searchRecords = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ message: "Missing query" });
  }
  const embedding = await buildEmbedding(query);
  const records = await MedicalRecord.find({ tenant: req.user.tenant, patient: req.user._id });
  const scored = records
    .map((record) => ({
      record,
      score: cosineSimilarity(embedding, record.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json({ results: scored });
};

export const getSummary = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const totalRecords = await MedicalRecord.countDocuments({ tenant: req.user.tenant, patient: req.user._id });
  const records = await MedicalRecord.find({ tenant: req.user.tenant, patient: req.user._id });
  const emergencyCases = records.filter((r) => r.integrity === "verified" || r.metadata?.priority === "emergency").length;
  res.json({
    totalRecords,
    totalPatients: 1,
    emergencyCases,
    avgLengthOfStay: "7.5 days"
  });
};

export const getLatest = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const records = await MedicalRecord.find({ tenant: req.user.tenant, patient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("_id patientName fileType createdAt metadata summary");
  res.json(records);
};

export const deleteRecord = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const record = await MedicalRecord.findOne({ _id: req.params.id, tenant: req.user.tenant, patient: req.user._id });
  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }
  await record.deleteOne();
  res.json({ message: "Record deleted successfully" });
};

export const maxUploadSizeBytes = config.MAX_FILE_MB * 1024 * 1024;
