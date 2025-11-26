import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { User, IUser } from "../models/User";
import { verifyAccessToken } from "../utils/generateTokens";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization?.split(" ");
    let token: string | undefined;
    if (authHeader && authHeader[0] === "Bearer") {
      token = authHeader[1];
    } else if (req.cookies?.[config.SESSION_COOKIE_NAME]) {
      token = req.cookies[config.SESSION_COOKIE_NAME];
    }
    if (!token) {
      return res.status(401).json({ message: "Missing authorization" });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
