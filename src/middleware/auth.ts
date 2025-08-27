import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};
