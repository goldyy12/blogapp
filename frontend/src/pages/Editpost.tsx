import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // import the axios instance
import "../styles/addpost.css";
import { AuthContext } from "../context/AuthContext";
import UseAuth from "../context/UseAuth";
import { Post } from "../types";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = UseAuth();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      if (!token) {
        setError("You must be logged in to edit posts.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<Post>(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      } catch (err: any) {
        const msg =
          err.response?.data?.error || err.message || "Failed to load post.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token, user?.userId]);

  const editPost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to edit posts.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.put<Post>(
        `/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/posts/user/${user?.userId}`);
    } catch (err: any) {
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
