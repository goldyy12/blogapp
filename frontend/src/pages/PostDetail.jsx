import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import styles from "../styles/Postdetail.module.css";
import { AuthContext } from "../context/AuthContext";

export default function PostDetail() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`http://localhost:5000/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);


    const addComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) return alert("You must be logged in");

        try {
            setIsSubmitting(true);

            await axios.post(
                `http://localhost:5000/posts/${id}/comments`,
                { content: comment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updated = await axios.get(
                `http://localhost:5000/posts/${id}`
            );

            setPost(updated.data);
            setComment("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.delete(
                `http://localhost:5000/posts/${id}/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            ;




            setPost((prev) => ({
                ...prev,
                comments: prev.comments.filter((c) => c.id !== commentId),
            }));
            console.log(post)
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className={styles.main}>
            <div className={styles.details}>
                <h1>{post.title}</h1>

                <div className={styles.info}>
                    <div className={styles.logo}>
                        {post.user?.username?.[0]?.toUpperCase()}
                    </div>

                    <div className={styles.username}>
                        <h3>{post.user?.username}</h3>
                        <p className={styles.date}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <p className={styles.content}>{post.content}</p>
                <div className={styles.divider}></div>

                <h3>Comments</h3>

                <form onSubmit={addComment} className={styles.form}>
                    <label>Name</label>
                    <input
                        type="text"
                        value={user?.email || ""}
                        disabled
                        className={styles.disabledInput}
                    />

                    <p className={styles.identityNote}>
                        You are commenting as <strong>{user?.email}</strong>
                    </p>

                    <label>Comment</label>
                    <textarea
                        value={comment}
                        placeholder="Write your comment..."
                        onChange={(e) => setComment(e.target.value)}
                        className={styles.textarea}
                        disabled={isSubmitting}
                    />

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Posting..." : "Add Comment"}
                    </button>
                </form>

                {post.comments.map((c) => {
                    const isOwner = user?.userId === c.userId;

                    return (
                        <li key={c.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <div className={styles.avatar}>
                                    {c.user?.username?.[0]?.toUpperCase()}
                                </div>

                                <div className={styles.meta}>
                                    <strong>{c.user?.username}</strong>
                                </div>
                                <span className={styles.date}>
                                    {new Date(c.createdAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </span>

                                {isOwner && (
                                    <button
                                        className={styles.deleteComment}
                                        onClick={() => handleDeleteComment(c.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            <p className={styles.commentText}>{c.content}</p>
                        </li>
                    );
                })}
            </div>
        </div>



    );
}
