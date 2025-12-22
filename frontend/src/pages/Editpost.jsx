import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // import the axios instance
import "../styles/addpost.css";
import { AuthContext } from "../context/AuthContext";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            if (!token) {
                setError("You must be logged in to edit posts.");
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTitle(res.data.title || "");
                setContent(res.data.content || "");
            } catch (err) {
                const msg =
                    err.response?.data?.error || err.message || "Failed to load post.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, token, user.id]);

    const editPost = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("You must be logged in to edit posts.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await api.put(
                `/posts/${id}`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/posts/user/${user.userId}`);
        } catch (err) {
            const msg =
                err.response?.data?.error || err.message || "Failed to update post.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading post...</p>;

    return (
        <div className="addpost-container">
            <h2>Edit Post</h2>
            <form onSubmit={editPost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="content form-textarea"
                    rows={6}
                    required
                />
                <button
                    type="submit"
                    disabled={saving || !title || !content}
                    className="form-button"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
