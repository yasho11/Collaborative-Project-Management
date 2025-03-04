import Router from "express";
import { verifyToken } from "../middleware/verifytoken";
import {
  assignTask,
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/TaskController";

const router = Router();

router.post("/", verifyToken, createTask); // Create a new task
router.get("/:projectId", verifyToken, getAllTasks); //Get all task assigned   to thae  logged in  user
router.get("/:taskId", verifyToken, getTaskById); //get details of specific task
router.put("/:taskId", verifyToken, updateTask); //update task detail
router.delete("/:taskId", verifyToken, deleteTask); //delete task
router.post("/:taskId/assign", verifyToken, assignTask); //assisgn task
router.post("/:taskId/comments", verifyToken, addComment); //Add a comment status
router.put("/:taskId/comments/:commentId", verifyToken, updateComment); //update comment status
router.delete("/:taskId/comments/:commentId", verifyToken, deleteComment); //Delete comment

export default router;
