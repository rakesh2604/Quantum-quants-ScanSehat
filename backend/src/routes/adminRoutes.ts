import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { listTenants, updateTenantPlan } from "../controllers/adminController";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/tenants", listTenants);
router.patch("/tenants/:tenantId", updateTenantPlan);

export default router;

