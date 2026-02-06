import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentcontroller.js"; // ensure correct filename/casing
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// parent provides req.params.postId
router.get("/", getComments);
router.post("/", authenticateToken, createComment);
router.put("/:commentId", authenticateToken, updateComment);
router.delete("/:commentId", authenticateToken, deleteComment);

export default router;
