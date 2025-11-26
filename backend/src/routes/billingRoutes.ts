import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { createCheckout, getSubscription, listPlans } from "../controllers/billingController";

const router = Router();

router.get("/plans", listPlans);
router.get("/subscription", authenticate, getSubscription);
router.post("/create-checkout-session", authenticate, requireRole("admin"), createCheckout);

export default router;

