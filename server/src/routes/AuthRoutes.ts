import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  UpdateProfile,
} from "../controllers/AuthController";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "public/uploads" });

router.post("/register",upload.single("ProfileURL"),register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.put("/update-profile", UpdateProfile);

export default router;
