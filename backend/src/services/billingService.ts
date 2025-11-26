import Stripe from "stripe";
import { config } from "../config";
import { logger } from "../utils/logger";
import { Subscription } from "../models/Subscription";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

type CheckoutInput = {
  tenantId: string;
  plan: "pro" | "enterprise";
  successUrl: string;
  cancelUrl: string;
};

export const createCheckoutSession = async ({ tenantId, plan, successUrl, cancelUrl }: CheckoutInput) => {
  const priceId = plan === "enterprise" ? config.STRIPE_PRICE_ENTERPRISE : config.STRIPE_PRICE_PRO_MONTH;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: undefined,
    metadata: {
      tenantId,
      plan
    },
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  return session;
};

export const handleStripeWebhook = async (signature: string | undefined, payload: Buffer) => {
  if (!signature) {
    throw new Error("Missing stripe signature");
  }
  const event = stripe.webhooks.constructEvent(payload, signature, config.STRIPE_WEBHOOK_SECRET);
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.metadata?.tenantId;
      const plan = session.metadata?.plan as "pro" | "enterprise";
      if (tenantId && plan) {
        await Subscription.findOneAndUpdate(
          { tenant: tenantId },
          {
            plan,
            status: "active",
            stripeCustomerId: session.customer?.toString(),
            stripeSubscriptionId: session.subscription?.toString(),
            currentPeriodEnd: new Date(((session.expires_at ?? 0) || 0) * 1000)
          },
          { upsert: true }
        );
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const tenantId = subscription.metadata?.tenantId;
      if (tenantId) {
        await Subscription.findOneAndUpdate({ tenant: tenantId }, { status: "canceled" });
      }
      break;
    }
    default:
      logger.debug({ type: event.type }, "Unhandled stripe event");
  }
};

