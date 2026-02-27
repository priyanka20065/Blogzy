
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./blogDetail.css";

function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [readTime, setReadTime] = useState(0);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/blogs/${id}`, {
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

                // Reading time
                const wordsPerMinute = 200;
                const wordCount = data.blog.content?.trim().split(/\s+/).length || 0;
                setReadTime(Math.ceil(wordCount / wordsPerMinute));
            } catch (err) {
                console.error("Error fetching blog:", err);
            }
        }

        fetchBlog();
    }, [id]);

    if (!blog) return <p className="loading-text">Loading blog...</p>;

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
        </div>
    );
}

export default BlogDetails;