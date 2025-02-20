import Router from "express";
import { verifyToken } from "../middleware/verifytoken";

const router = Router();

router.post("/", verifyToken); // Create a new task
router.get("/", verifyToken); //Get all task assigned   to thae  logged in  user
router.get("/:id", verifyToken);//get details of specific task
router.put("/:id", verifyToken);//update task detail
router.delete("/:id", verifyToken);//delete task 
router.post("/:id/assign", verifyToken);//assisgn task
router.post("/id/comments/:commentId", verifyToken);//Add a comment status
router.put("/:id/comments/commentId", verifyToken);//update comment status
router.delete("/:id/comments/:commentId", verifyToken);//Delete comment

export default router;
