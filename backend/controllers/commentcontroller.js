import prisma from "../db.js";

export const getComments = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: { user: { select: { username: true } } },
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createComment = async (req, res) => {
    const postId = parseInt(req.params.id);
    const { content, username, email } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: { content, postId, userId: req.user?.userId, username, email }, include: { user: true },
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateComment = async (req, res) => {
    const id = parseInt(req.params.commentId);
    const { content } = req.body;

    try {
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (comment.userId !== req.user.userId) return res.status(403).json({ error: "Not allowed" });

        const updatedComment = await prisma.comment.update({ where: { id }, data: { content } });
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    const id = parseInt(req.params.commentId);
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment) return res.status(404).json({ error: "Comment not found" });
        if (comment.userId !== req.user.userId) return res.status(403).json({ error: "Not allowed" });

        await prisma.comment.delete({ where: { id } });
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
