import prisma from "../db.js";
import { type Request, type Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },

      include: { user: { select: { username: true, email: true } } },
    });
    return res.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

export const getPostsByUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string);
  console.log(userId);
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: { select: { username: true, email: true } },
        comments: {
          include: { user: { select: { username: true } } },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, email: true } },
        comments: { include: { user: { select: { username: true } } } },
      },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, userId: req.user?.userId as number },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ error: "Could not create post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId !== req.user?.userId)
      return res.status(403).json({ error: "Not allowed" });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId !== req.user?.userId && req.user?.role !== "AUTHOR") {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.post.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.userId !== req.user?.userId)
      return res.status(403).json({ error: "Not allowed" });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: true },
    });
    res.json(updatedPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
