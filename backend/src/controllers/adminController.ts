import { Request, Response } from "express";
import { z } from "zod";
import { Tenant } from "../models/Tenant";
import { Subscription } from "../models/Subscription";

const updateSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
  status: z.enum(["trialing", "active", "suspended"]).optional()
});

export const listTenants = async (_req: Request, res: Response) => {
  const tenants = await Tenant.find().lean();
  const subscriptions = await Subscription.find().lean();
  const subscriptionMap = new Map(subscriptions.map((sub) => [sub.tenant.toString(), sub]));
  const enriched = tenants.map((tenant) => ({
    ...tenant,
    subscription: subscriptionMap.get(tenant._id.toString())
  }));
  res.json({ tenants: enriched });
};

export const updateTenantPlan = async (req: Request, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const tenantId = req.params.tenantId;
  await Tenant.findByIdAndUpdate(tenantId, { status: parsed.data.status });
  if (parsed.data.plan) {
    await Subscription.findOneAndUpdate(
      { tenant: tenantId },
      { plan: parsed.data.plan, status: parsed.data.status ?? "active" },
      { upsert: true }
    );
  }
  const tenant = await Tenant.findById(tenantId);
  res.json({ tenant });
};

