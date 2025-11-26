import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth";
import { Tenant } from "../models/Tenant";
import { Subscription } from "../models/Subscription";
import { User } from "../models/User";
import { MedicalRecord } from "../models/MedicalRecord";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().optional(),
  primaryContact: z.string().optional(),
  contactEmail: z.string().email().optional(),
  address: z.string().optional()
});

export const getTenantSummary = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const tenant = await Tenant.findById(req.user.tenant);
  const subscription = await Subscription.findOne({ tenant: req.user.tenant });
  const memberCount = await User.countDocuments({ tenant: req.user.tenant });
  const recordCount = await MedicalRecord.countDocuments({ tenant: req.user.tenant });
  const doctorCount = await User.countDocuments({ tenant: req.user.tenant, role: "doctor" });

  res.json({
    tenant,
    metrics: {
      memberCount,
      recordCount,
      doctorCount,
      plan: subscription?.plan ?? "free",
      subscriptionStatus: subscription?.status ?? "trialing"
    }
  });
};

export const updateTenant = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const tenant = await Tenant.findByIdAndUpdate(req.user.tenant, parsed.data, { new: true });
  res.json({ tenant });
};

export const listMembers = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const members = await User.find({ tenant: req.user.tenant }).select("name email role emailVerified lastLoginAt");
  res.json({ members });
};

