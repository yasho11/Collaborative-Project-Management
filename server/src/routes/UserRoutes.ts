import { Router, Response, Request } from "express";
import {
  getAllUsers,
  getUserById,
  DeleteUser,
} from "../controllers/UserController";
import { verifyToken } from "../middleware/verifytoken";
import { verifyPassword } from "../controllers/AuthController";
const router = Router();

router.get("/all", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", verifyToken, DeleteUser);

export default router;
