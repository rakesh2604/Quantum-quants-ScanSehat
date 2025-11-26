import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

export const requireRole = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
};
