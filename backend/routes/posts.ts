import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  getPostsByUser,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function requireAuthor(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "AUTHOR") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

router.get("/user/:userId", getPostsByUser);
router.get("/", getPosts);
router.get("/:id", getPost);

router.delete("/:id", authenticateToken, deletePost);

router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);

router.put("/:id/publish", authenticateToken, requireAuthor, publishPost);

export default router;
