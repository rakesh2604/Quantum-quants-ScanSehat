import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { getTenantSummary, listMembers, updateTenant } from "../controllers/tenantController";

const router = Router();

router.get("/me", authenticate, getTenantSummary);
router.patch("/me", authenticate, requireRole("admin"), updateTenant);
router.get("/members", authenticate, requireRole("admin"), listMembers);

export default router;

