import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  UpdateProfile,
  verifyPassword,
} from "../controllers/AuthController";
import multer from "multer";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();
const upload = multer({ dest: "public/uploads" });

router.post("/register", upload.single("ProfileURL"), register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.post("/verify-password", verifyToken, verifyPassword);
router.put(
  "/update-profile",
  verifyToken,
  upload.single("ProfileURL"),
  UpdateProfile
);

export default router;
