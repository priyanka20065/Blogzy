

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./blogDetail.css";
const apiUrl = import.meta.env.VITE_API_URL;


function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [readTime, setReadTime] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);


    useEffect(() => {
        async function fetchBlog() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    if (res.status == 401) {
                        navigate("/login");
                    }
                    return;
                }
                const data = await res.json();

                if (!data.blog) {
                    console.error("Blog not found");
                    return;
                }

                setBlog(data.blog);
                setComments(data.blog.comments || []);

                // Reading time
                const wordsPerMinute = 200;
                                const apiUrl = import.meta.env.VITE_API_URL;
                                const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
                setReadTime(Math.ceil(wordCount / wordsPerMinute));
            } catch (err) {
                console.error("Error fetching blog:", err);
            }
        }

        fetchBlog();
    }, [id]);

    // Handle comment submit
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setCommentLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/api/blogs/${id}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: commentText }),
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
                setCommentText("");
            } else {
                const err = await res.json();
                alert(err.msg || "Failed to post comment");
            }
        } catch (err) {
            alert("Error posting comment");
        } finally {
            setCommentLoading(false);
        }
    };

                            const res = await fetch(`${apiUrl}/api/blogs/${id}/comment`, {

    const author = blog.author; // ✅ DIRECT FROM BACKEND

    return (
        <div className="blog-details-container">
            <div className="back-button" onClick={() => navigate(-1)}>
                ← GO BACK
            </div>

            <h1 className="blog-title">{blog.title}</h1>

            <div className="blog-meta">
                <span>
                    {new Date(blog.createdAt).toDateString()} |{" "}
                    {blog.category?.toUpperCase()}
                </span>
                <span>{readTime} min read</span>
            </div>

            {blog.image && (
                <img src={blog.image} alt={blog.title} className="blog-main-image" />
            )}

            <div className="blog-content">
                <p>{blog.content}</p>
            </div>

            {/* Premium/author-only comment form and comments list */}
            <div className="comments-section">
                <h3>Comments</h3>
                {comments.length === 0 && <p>No comments yet.</p>}
                <ul className="comments-list">
                    {comments.map((c, idx) => (
                        <li key={c._id || idx} className="comment-item">
                            <strong>{c.user?.name || "User"}</strong>:
                            <span> {c.text}</span>
                            <span style={{ color: '#aaa', marginLeft: 8, fontSize: 12 }}>
                                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                            </span>
                        </li>
                    ))}
                </ul>
                {(() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user && (user.isPremium || user.role === "author")) {
                        return (
                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                <textarea
                                    placeholder="Write a comment..."
                                    className="comment-input"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    disabled={commentLoading}
                                />
                                <button type="submit" className="comment-btn" disabled={commentLoading}>
                                    {commentLoading ? "Posting..." : "Post Comment"}
                                </button>
                            </form>
                        );
                    } else {
                        return <p style={{color: '#888', marginTop: '1rem'}}>Subscribe to comment on posts.</p>;
                    }
                })()}
            </div>
        </div>
    );
}

export default BlogDetails;