import { Router } from "express";

import { verifyToken } from "../middleware/verifytoken";
import {
  addMemberToProject,
  createProject,
  deleteProject,
  getProjectById,
  getProjectByPeople,
  inviteMember,
  makeAdmin,
  removeMember,
  updateProject,
} from "../controllers/ProjectController";

const router = Router();

router.post("/", verifyToken, createProject);
router.get("/:workspaceid", verifyToken, getProjectByPeople);
router.get("/:projectId", verifyToken, getProjectById);
router.put("/:porjectId", verifyToken, updateProject);
router.delete(":/id", verifyToken, deleteProject);
router.post("/join", verifyToken, addMemberToProject);
router.post("/invite", verifyToken, inviteMember);
router.post("/:_id/addAdmin", verifyToken, makeAdmin);
router.delete("/:_id/deleteMember", verifyToken, removeMember);
export default router;
