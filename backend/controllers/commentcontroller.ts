import prisma from "../db.js";
import { type Request, type Response } from "express";

export const getComments = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string);
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { username: true } } },
    });
    return res.json(comments);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string);
  const { content, username, email } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        // req.user is now globally recognized!
        userId: req.user?.userId as number,
        username,
        email,
      },
      include: { user: true },
    });
    return res.status(201).json(comment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.commentId as string);
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId !== req.user?.userId)
      return res.status(403).json({ error: "Not allowed" });

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    return res.json(updatedComment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.commentId as string);

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId !== req.user.userId)
      return res.status(403).json({ error: "Not allowed" });

    await prisma.comment.delete({ where: { id } });
    return res.json({ message: "Comment deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};
