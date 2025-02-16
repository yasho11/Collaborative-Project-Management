import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  DeleteUser,
} from "../controllers/UserController";
import { verifyToken } from "../middleware/verifytoken";
const router = Router();

router.get("/all", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", verifyToken, DeleteUser);
export default router;
