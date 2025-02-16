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
  } else {
    console.log("Received token: ", token);
    try {
      if (JWT_SECRET) {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        console.log("Decoded Payload: ", decoded);
        req.UserEmail = decoded.email;
        req.role = decoded.role;
        req.id = decoded.id;
        next();
      } else {
        res.status(400).json("Secret not found");
      }
    } catch (error) {
      console.error("JWT verification error: ", error);
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
  }
};
