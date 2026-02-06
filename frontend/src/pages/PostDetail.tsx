import { useParams } from "react-router-dom";
import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../api";
import styles from "../styles/postdetail.module.css";
import useAuth from "../context/UseAuth";
import { User, Comment, Post } from "../types"; // Added Post here

export default function PostDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>(); // 1. Type the URL parameter

  // 2. Explicitly type the post state
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        // 3. Tell Axios to expect the Post shape
        const res = await api.get<Post>(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 4. Type the form event
  const addComment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      setIsSubmitting(true);

      await api.post(
        `/posts/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updated = await api.get<Post>(`/posts/${id}`);
      setPost(updated.data);
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Type the ID parameter
  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.delete(`/posts/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 6. Use a functional update and check for post existence
      setPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        };
      });
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
            // 7. Type the ChangeEvent
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
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

        {(!post.comments || post.comments.length === 0) && (
          <h4>No comments yet, add one!</h4>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {post.comments.map((c: Comment) => {
            const isOwner = user?.userId === String(c.userId); // Ensure types match for comparison
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
                    {new Date(c.createdAt).toLocaleString()}
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
        </ul>
      </div>
    </div>
  );
}
