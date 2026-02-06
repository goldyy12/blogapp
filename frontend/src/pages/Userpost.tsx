import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/userposts.css";
// import useAuth from "../context/UseAuth"; // Import used if checking ownership logic
import { Post } from "../types";

export default function UserPosts() {
  const navigate = useNavigate();

  // 1. Type the URL parameter so TS knows userId is a string
  const { userId } = useParams<{ userId: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("token");

  const fetchUserPosts = async () => {
    setLoading(true);
    setError("");
    try {
      // 2. Type the axios response
      const res = await api.get<Post[]>(`/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPosts();
  }, [userId]);

  const handleDelete = async (id: number) => {
    // Basic confirmation is always a good idea for delete actions
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserPosts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="user-posts-container">
      <h2>User's Posts</h2>

      {loading && <p>Loading posts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && posts.length === 0 && (
        <div className="no-posts">
          <h3>No posts from you</h3>
          <Link to="/addpost">
            <button className="primary-btn">Add a Post</button>
          </Link>
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>{post.content}</p>
            {/* Optional chaining safely handles potential null users */}
            <small>By: {post.user?.email}</small>

            <div className="post-actions">
              <button
                className="delete-btn"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
              <button
                className="edit-btn"
                onClick={() => navigate(`/posts/${post.id}/edit`)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link to="/posts">
        <button className="primary-btn">Back to Home</button>
      </Link>
    </div>
  );
}
