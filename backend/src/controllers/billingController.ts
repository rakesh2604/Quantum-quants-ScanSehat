import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth";
import { createCheckoutSession, handleStripeWebhook } from "../services/billingService";
import { Subscription } from "../models/Subscription";
import { logger } from "../utils/logger";

const checkoutSchema = z.object({
  plan: z.enum(["pro", "enterprise"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export const listPlans = async (_req: Request, res: Response) => {
  const plans = [
    {
      name: "Free",
      price: 0,
      frequency: "forever",
      features: ["Encrypted uploads", "Patient vault", "OTP/QR sharing"],
      plan: "free"
    },
    {
      name: "Pro",
      price: 49,
      frequency: "per org / month",
      features: ["Everything in Free", "AI triage summaries", "5 doctor seats", "Priority support"],
      plan: "pro"
    },
    {
      name: "Enterprise",
      price: 249,
      frequency: "per org / month",
      features: ["Unlimited seats", "Custom SLA", "On-prem escrow", "Governance tooling"],
      plan: "enterprise"
    }
  ];
  res.json({ plans });
};

export const createCheckout = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  const { plan, successUrl, cancelUrl } = parsed.data;
  const session = await createCheckoutSession({
    tenantId: req.user.tenant.toString(),
    plan,
    successUrl,
    cancelUrl
  });

  res.json({ checkoutUrl: session.url });
};

export const getSubscription = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const subscription = await Subscription.findOne({ tenant: req.user.tenant });
  res.json({ subscription });
};

export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const payload = req.body as Buffer;
    await handleStripeWebhook(signature, payload);
    res.json({ received: true });
  } catch (error) {
    logger.error({ error }, "Failed to process stripe webhook");
    res.status(400).json({ message: "Webhook error" });
  }
};

