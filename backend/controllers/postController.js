import prisma from "../db.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },

            include: { user: { select: { username: true, email: true }, }, },
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostsByUser = async (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log(userId)
    try {
        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },

            include: {
                user: { select: { username: true, email: true } }, comments: {
                    include: { user: { select: { username: true } } }
                },
            }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPost = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const post = await prisma.post.findUnique({ where: { id }, include: { user: { select: { username: true, email: true } }, comments: { include: { user: { select: { username: true } } } } } });
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = await prisma.post.create({
            data: { title, content, userId: req.user.userId },
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error("createPost error:", error);
        res.status(500).json({ error: "Could not create post" });
    }
}

export const updatePost = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.userId !== req.user.userId) return res.status(403).json({ error: "Not allowed" });

        const updatedPost = await prisma.post.update({ where: { id }, data: req.body });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const deletePost = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) return res.status(404).json({ error: "Post not found" });


        if (post.userId !== req.user.userId && req.user.role !== "AUTHOR") {
            return res.status(403).json({ error: "Not allowed" });
        }


        await prisma.post.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const publishPost = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.userId !== req.user.userId) return res.status(403).json({ error: "Not allowed" });

        const updatedPost = await prisma.post.update({ where: { id }, data: { published: true } });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
