import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { generateOTP, verifyOTP } from "../services/otpService";
import { issueSessionToken } from "../services/cryptoService";
import { AccessSession } from "../models/AccessSession";
import { AccessLog } from "../models/AccessLog";
import { MedicalRecord } from "../models/MedicalRecord";
import { config } from "../config";
import { generateQRDataUrl } from "../utils/generateQR";
import { sha256 } from "../utils/hash";

const sessionExpiry = () => new Date(Date.now() + config.SESSION_TTL_MIN * 60 * 1000);

export const generateAccessSession = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const { doctorEmail, channel = "otp" } = req.body as { doctorEmail?: string; channel?: "otp" | "qr" };
  if (!doctorEmail) {
    return res.status(400).json({ message: "doctorEmail is required" });
  }
  if (!["otp", "qr"].includes(channel)) {
    return res.status(400).json({ message: "channel must be otp or qr" });
  }

  const sessionToken = issueSessionToken();
  const expiresAt = sessionExpiry();
  const ephemeralKey = issueSessionToken();

  const basePayload: any = {
    tenant: req.user.tenant,
    patient: req.user._id,
    doctorEmail,
    channel,
    sessionToken,
    expiresAt,
    ephemeralKey
  };

  if (channel === "otp") {
    const otpBundle = generateOTP();
    basePayload.otpHash = otpBundle.hash;
    await AccessSession.create(basePayload);
    await AccessLog.create({ tenant: req.user.tenant, patient: req.user._id, doctorEmail, action: "OTP_ISSUED" });
    return res.status(201).json({ otp: otpBundle.otp, sessionToken, expiresAt, ephemeralKey });
  }

  const qrPayload = JSON.stringify({ sessionToken, doctorEmail, issuedAt: new Date().toISOString() });
  const qrHash = sha256(qrPayload);
  basePayload.qrHash = qrHash;
  const qr = await generateQRDataUrl(qrPayload);
  await AccessSession.create(basePayload);
  await AccessLog.create({ tenant: req.user.tenant, patient: req.user._id, doctorEmail, action: "QR_ISSUED" });
  return res.status(201).json({ qr, sessionToken, expiresAt, ephemeralKey, qrPayload });
};

export const redeemAccess = async (req: Request, res: Response) => {
  const { doctorEmail, otp, qrPayload } = req.body as { doctorEmail?: string; otp?: string; qrPayload?: string };
  if (!doctorEmail) {
    return res.status(400).json({ message: "doctorEmail is required" });
  }
  let session: any;
  if (otp) {
    session = await AccessSession.findOne({ doctorEmail, channel: "otp", status: "pending" }).sort({ createdAt: -1 });
    if (!session) {
      return res.status(404).json({ message: "No OTP session found" });
    }
    if (!session.otpHash || !verifyOTP(otp, session.otpHash)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } else if (qrPayload) {
    const qrHash = sha256(qrPayload);
    session = await AccessSession.findOne({ doctorEmail, channel: "qr", status: "pending", qrHash });
    if (!session) {
      return res.status(404).json({ message: "QR session not found" });
    }
  } else {
    return res.status(400).json({ message: "Provide either otp or qrPayload" });
  }

  if (session.expiresAt.getTime() < Date.now()) {
    session.status = "expired";
    await session.save();
    return res.status(410).json({ message: "Session expired" });
  }

  session.status = "redeemed";
  session.redeemedAt = new Date();
  await session.save();
  await AccessLog.create({
    tenant: session.tenant,
    patient: session.patient,
    doctorEmail,
    action: otp ? "OTP_REDEEMED" : "QR_REDEEMED"
  });
  res.json({ sessionToken: session.sessionToken, expiresAt: session.expiresAt, ephemeralKey: session.ephemeralKey });
};

export const sessionRecords = async (req: Request, res: Response) => {
  const { token } = req.params;
  const doctorEmail = req.query.doctorEmail as string;
  const ephemeralKey = req.query.ephemeralKey as string;
  if (!doctorEmail || !ephemeralKey) {
    return res.status(400).json({ message: "doctorEmail and ephemeralKey are required" });
  }
  const session = await AccessSession.findOne({ sessionToken: token, doctorEmail });
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }
  if (session.ephemeralKey !== ephemeralKey) {
    return res.status(401).json({ message: "Invalid ephemeral key" });
  }
  if (session.expiresAt.getTime() < Date.now() || session.status === "expired") {
    session.status = "expired";
    await session.save();
    return res.status(410).json({ message: "Session expired" });
  }
  if (session.status !== "redeemed") {
    return res.status(403).json({ message: "Session pending redemption" });
  }
  const records = await MedicalRecord.find({ tenant: session.tenant, patient: session.patient }).select(
    "fileUrl encryption summary metadata structuredData createdAt fileType fileSize integrity"
  );
  await AccessLog.create({
    tenant: session.tenant,
    patient: session.patient,
    doctorEmail: session.doctorEmail,
    action: "RECORDS_VIEWED",
    details: { count: records.length }
  });
  res.json({ records, expiresAt: session.expiresAt });
};

export const listLogs = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const logs = await AccessLog.find({ tenant: req.user.tenant, patient: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ logs });
};
