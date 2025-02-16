import { Router } from "express";
import {
  createWorkspace,
  getAllWorkspace,
  getWorkspaceById,
} from "../controllers/WorkSpaceController";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();

router.post("/", verifyToken, createWorkspace);
router.get("/", verifyToken, getAllWorkspace);
router.get("/:_id", verifyToken, getWorkspaceById);
export default router;
