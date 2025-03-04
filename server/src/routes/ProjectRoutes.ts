import { Router } from "express";

import { verifyToken } from "../middleware/verifytoken";
import {
  addMemberToProject,
  createProject,
  deleteProject,
  getMember,
  getProjectById,
  getProjectByPeople,
  inviteMember,
  makeAdmin,
  removeMember,
  updateProject,
} from "../controllers/ProjectController";

const router = Router();

router.post("/:workspaceId", verifyToken, createProject);
router.get("/ws/:workspaceid", verifyToken, getProjectByPeople);
router.get("/:projectId", verifyToken, getProjectById);
router.put("/:projectId", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);
router.get("/member/:projectId", verifyToken, getMember);
router.post("/join", verifyToken, addMemberToProject);
router.post("/invite", verifyToken, inviteMember);
router.post("/:_id/addAdmin", verifyToken, makeAdmin);
router.delete("/:_id/deleteMember", verifyToken, removeMember);
export default router;
