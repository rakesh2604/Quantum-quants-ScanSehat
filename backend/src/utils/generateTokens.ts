import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "../models/User";

export type TokenPayload = {
  sub: string;
  role: UserRole;
  tenant: string;
};

export const generateAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, config.JWT_SECRET as Secret, { expiresIn: config.JWT_EXPIRY as SignOptions["expiresIn"] });

export const generateRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, config.REFRESH_SECRET as Secret, { expiresIn: config.REFRESH_EXPIRY as SignOptions["expiresIn"] });

export const verifyAccessToken = (token: string) => jwt.verify(token, config.JWT_SECRET as Secret) as TokenPayload;

export const verifyRefreshToken = (token: string) => jwt.verify(token, config.REFRESH_SECRET as Secret) as TokenPayload;
