import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api"; // use the central axios instance
import "../styles/userposts.css";

export default function UserPosts() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchUserPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/posts/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchUserPosts();
    }, [userId]);

    const handleDelete = async (id) => {
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
                        <small>By: {post.user?.email}</small>
                        <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                            Delete
                        </button>
                        <button
                            className="edit-btn"
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            <Link to="/posts">
                <button className="primary-btn">Back to Home</button>
            </Link>
        </div>
    );
}