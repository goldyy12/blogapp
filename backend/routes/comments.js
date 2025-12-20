import express from "express";
import {
    getComments,
    createComment,
    updateComment,
    deleteComment
} from "../controllers/commentcontroller.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", authenticateToken, createComment);
router.put("/:postId/:commentId", authenticateToken, updateComment);
// commentRoutes.js
router.delete("/:commentId", authenticateToken, deleteComment);

export default router;
