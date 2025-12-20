import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../styles/Posts.module.css";
import { AuthContext } from "../context/AuthContext";

export default function Posts() {
    const { user } = useContext(AuthContext); // ✅ inside component

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const getPosts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("http://localhost:5000/posts");
            setPosts(res.data);
        } catch (err) {
            setError("Failed to load posts");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            getPosts();
        } catch (err) {
            console.log("Delete failed", err);
        }
    };

    return (
        <div>

            <div className={styles.section}>
                <div className={styles.sectioncontent}>
                    <p className={styles.share}>Share your ideas with the world</p>
                    <h4 >
                        Join our community of writers and readers passionate
                        about technology, design, and creativity.
                    </h4>

                    <div className={styles.welcome}>
                        {user ? (
                            <>
                                <h2>Welcome back , {user.email}</h2>
                                <p>Ready to share your thoughts with the community?</p>

                                <div>
                                    <Link to="/addpost" className={styles.btnPrimary}>
                                        Create New Post
                                    </Link>

                                    <Link
                                        to={`/posts/user/${user.userId}`}
                                        className={styles.btnSecondary}
                                    >
                                        My Posts
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>WELCOME</h2>
                                <p>Join us and start sharing your ideas today.</p>

                                <div>
                                    <Link to="/login" className={styles.btnPrimary}>
                                        Log in
                                    </Link>

                                    <Link to="/signup" className={styles.btnSecondary}>
                                        Sign up
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>




            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {posts.length === 0 && !loading && !error && <p>No posts yet, add one!</p>}


            <div className={styles.title}>
                <h2>Last Posts</h2>

                <div className={styles.postcontainer}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.posts}>
                            <Link to={`/posts/${post.id}`}>
                                <h3>{post.title}</h3>
                            </Link>

                            <p>{post.content}</p>

                            <div className={styles.postuser}>
                                <p className={styles.name}>{post.user?.username}</p>
                                <p className={styles.date}>
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className={styles.divider}></div>

                            <Link to={`/posts/${post.id}`}>Read More →</Link>

                            {user?.role === "AUTHOR" && (
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
