import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import styles from "../styles/posts.module.css";
import { Post } from "../types"; // Import the Post interface
import useAuth from "../context/UseAuth";

export default function Posts() {
  const { user } = useAuth();

  // 1. Type the state as an array of Post
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const getPosts = async () => {
    setLoading(true);
    setError("");
    try {
      // 2. Tell the API call to expect an array of Post in the response data
      const res = await api.get<Post[]>("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Posts component mounted!");
    getPosts();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`, {
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
          <h4>
            Join our community of writers and readers passionate about
            technology, design, and creativity.
          </h4>

          <div className={styles.welcome}>
            {user ? (
              <>
                <h2>Welcome back, {user.email}</h2>
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

      <div className={styles.title}>
        <h2 className={styles.last}>Last Posts</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {posts.length === 0 && !loading && !error && (
          <p>No posts yet, add one!</p>
        )}

        <div className={styles.postcontainer}>
          {/* 3. 'post' is now automatically typed as 'Post' here */}
          {posts.map((post) => (
            <div key={post.id} className={styles.posts}>
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
              <p className={styles.postContent}>{post.content}</p>
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
