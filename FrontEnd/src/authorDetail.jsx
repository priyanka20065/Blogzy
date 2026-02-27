import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BlogCard from "./blogCard";
import "./authorDetail.css";

function AuthorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [error, setError] = useState(null);

    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        const fetchAuthorAndBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const currentUser = JSON.parse(localStorage.getItem("user"));

                /* ---------------- FETCH AUTHOR ---------------- */
                const authorRes = await fetch(
                    `/api/authors/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!authorRes.ok) {
                    if (authorRes.status === 401) {
                        navigate("/login");
                        return;
                    }
                    throw new Error("Author not found");
                }

                const authorData = await authorRes.json();
                setAuthor(authorData);
                setFollowerCount(authorData.followers?.length || 0);

                // Check if current user is following this author
                if (currentUser && authorData.followers) {
                    const isFollowing = authorData.followers.some(
                        (fid) => fid.toString() === currentUser._id
                    );
                    setFollowing(isFollowing);
                }

                /* ---------------- FETCH BLOGS ---------------- */
                const blogsRes = await fetch("/api/blogs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!blogsRes.ok) {
                    throw new Error("Failed to fetch blogs");
                }

                const blogsJson = await blogsRes.json();
                const blogsArray = blogsJson.blogs || [];

                /* ---------------- FILTER BLOGS SAFELY ---------------- */
                const authorBlogs = blogsArray.filter(
                    (b) => b.author && b.author._id === authorData._id
                );

                authorBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

                setBlogs(authorBlogs);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAuthorAndBlogs();
    }, [id, navigate]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/user/follow/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Could not update follow status");

            const data = await res.json();
            setFollowing(!following);
            setFollowerCount(data.followerCount);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    /* ---------------- UI STATES ---------------- */
    if (loading) return <p>Loading author...</p>;
    if (error) return <p>{error}</p>;
    if (!author) return <p>Author not found</p>;

    return (
        <div className="authorDetail-container">
            {/* HERO SECTION */}
            <div className="authorDetail-hero">
                <div className="authorDetail-back" onClick={() => navigate(-1)}>
                    <span>← Back</span>
                </div>

                <div className="authorDetail-header">
                    <div className="authorDetail-left-side">
                        <img
                            src={author.image || "/assets/author-placeholder.png"}
                            alt={author.name}
                            className="authorDetail-img"
                        />
                        <h1 className="authorDetail-name">{author.name}</h1>
                        <div className="authorDetail-actions">
                            <button
                                className={`authorDetail-follow-btn ${following ? "following" : ""}`}
                                onClick={handleFollow}
                            >
                                {following ? "Following" : "Follow"}
                            </button>
                        </div>
                    </div>

                    <div className="authorDetail-right-side">
                        <div className="authorDetail-stats">
                            <div className="authorDetail-stat-item">
                                <span className="authorDetail-stat-value">{author.blogsCount || 0}</span>
                                <span className="authorDetail-stat-label">Blogs</span>
                            </div>
                            <div className="authorDetail-stat-item">
                                <span className="authorDetail-stat-value">{followerCount}</span>
                                <span className="authorDetail-stat-label">Followers</span>
                            </div>
                        </div>

                        {author.bio && <p className="authorDetail-bio">{author.bio}</p>}
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="authorDetail-content">
                <h2 className="authorDetail-section-title">Latest Blogs</h2>

                <div className="authorDetail-grid">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className="authorDetail-article-wrapper">
                                <BlogCard
                                    id={blog._id}
                                    title={blog.heading}
                                    description={blog.content}
                                    category={blog.category}
                                    date={blog.date}
                                    image={blog.image}
                                    author={blog.author}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No blogs available by this author yet.</p>
                    )}
                </div>

                {/* SHOW ALL */}
                {blogs.length > 0 && (
                    <div
                        className="authorDetail-showBlogs"
                        onClick={() => navigate(`/blogs/author/${author.name}`)}
                    >
                        <span>View All Articles</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthorDetail;