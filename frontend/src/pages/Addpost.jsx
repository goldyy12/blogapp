import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/addpost.css";

export default function Addpost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const addPost = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/posts",
                { title, content },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            setTitle("");
            setContent("");
            navigate("/posts");
        } catch (error) {
            setError(error.response?.data?.message || "Adding post failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addpost-container">
            <h2>Add Post</h2>
            <form onSubmit={addPost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input

                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="content"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Post"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
    );
}
