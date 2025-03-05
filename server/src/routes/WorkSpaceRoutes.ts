import { Router } from "express";
import {
  addMember,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspace,
  getMember,
  getWorkspaceById,
  inviteMember,
  makeAdmin,
  removeMember,
  updateWorkspace,
  getUserInvitations
} from "../controllers/WorkSpaceController";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();

router.post("/", verifyToken, createWorkspace);
router.get("/", verifyToken, getAllWorkspace);
router.get("/:_id", verifyToken, getWorkspaceById);
router.put("/:_id", verifyToken, updateWorkspace);
router.delete("/:_id", verifyToken, deleteWorkspace);
router.get("/member/:WorkspaceId", verifyToken, getMember);
router.post("/join", verifyToken, addMember);
router.get("/mem/invitelist/",verifyToken, getUserInvitations);
router.delete("/:_id/members/:DeleteId", verifyToken, removeMember);
router.post("/invite", verifyToken, inviteMember);
router.post("/:_id/addAdmin", verifyToken, makeAdmin);
export default router;
