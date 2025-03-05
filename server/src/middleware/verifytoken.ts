import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

interface CustomRequest extends Request {
  UserEmail?: string;
  role?: string;
  id?: ObjectId;
}

interface JWTPayload {
  email: string;
  id?: ObjectId;
  role: string;
}
export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token required" });
    return;
  }

  console.log("Received token: ", token);

  try {
    if (JWT_SECRET) {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log("Decoded Payload: ", decoded);

      // Convert the string `id` to ObjectId
      req.id = new ObjectId(decoded.id); // This ensures `req.id` is an ObjectId
      req.UserEmail = decoded.email;
      req.role = decoded.role;

      console.log("Middleware set req.id to:", req.id); // Debug log
      next();
    } else {
      res.status(400).json("Secret not found");
    }
  } catch (error) {
    console.error("JWT verification error: ", error);
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
