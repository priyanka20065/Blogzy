
import BlogCard from "./blogCard";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./profile.css";


function Profile() {
    const [following, setFollowing] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myBlogs, setMyBlogs] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const storedUser = JSON.parse(localStorage.getItem("user"));
                setUser(storedUser);

                if (!token) {
                    navigate("/login");
                    return;
                }

                // Fetch following
                const res = await fetch("/api/user/following", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch following list");
                const data = await res.json();
                setFollowing(data.following);

                            const res = await fetch(`${apiUrl}/api/user/following`, {
                // Fetch my blogs (public and private)
                const blogsRes = await fetch("/api/blogs/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (blogsRes.ok) {
                    const blogsData = await blogsRes.json();
                    setMyBlogs(blogsData.blogs || []);
                            const blogsRes = await fetch(`${apiUrl}/api/blogs/my`, {

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) return <div className="profile-container">Loading profile...</div>;


    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <h1>My Profile</h1>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Status:</strong> {user?.role === "author" ? "Author" : user?.isPremium ? "Premium Reader" : "Free Member"}</p>
                    <div className="profile-stats">
                        <p><strong>Followers:</strong> {user?.followers?.length || 0}</p>
                        <p><strong>Following:</strong> {user?.following?.length || 0}</p>
                    </div>
                </div>
            </div>

            <hr className="profile-divider" />

            {/* My Blogs Section */}

            {/* My Blogs Section - Split for author, single for user */}
            <div className="profile-section">
                {user?.role === "author" ? (
                    <div className="myblogs-columns">
                        <div className="myblogs-col">
                            <h2>My Public Blogs</h2>
                            {myBlogs.filter(b => b.visibility === "public").length > 0 ? (
                                <div className="myblogs-list">
                                    {myBlogs.filter(b => b.visibility === "public").map((blog) => (
                                        <div key={blog._id} style={{ position: "relative" }}>
                                            <BlogCard
                                                id={blog._id}
                                                category={blog.category}
                                                date={blog.date}
                                                image={blog.image}
                                                title={blog.heading || blog.title}
                                                description={blog.content?.substring(0, 200) || ""}
                                                author={user}
                                            />
                                            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                                    style={{ padding: "4px 8px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm("Are you sure you want to delete this blog?")) return;
                                                        const token = localStorage.getItem("token");
                                                        const res = await fetch(`/api/blogs/${blog._id}`, {
                                                            method: "DELETE",
                                                            headers: { Authorization: `Bearer ${token}` },
                                                        });
                                                        if (res.ok) {
                                                            setMyBlogs(myBlogs.filter(b => b._id !== blog._id));
                                                        } else {
                                                            alert("Failed to delete blog.");
                                                        }
                                                    }}
                                                    style={{ padding: "4px 8px", background: "#fdd", border: "1px solid #f99", borderRadius: 4, cursor: "pointer" }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-following">No public blogs yet.</p>
                            )}
                        </div>
                        <div className="myblogs-col">
                            <h2>My Private Blogs</h2>
                            {myBlogs.filter(b => b.visibility === "private").length > 0 ? (
                                <div className="myblogs-list">
                                    {myBlogs.filter(b => b.visibility === "private").map((blog) => (
                                        <BlogCard
                                            key={blog._id}
                                            id={blog._id}
                                            category={blog.category}
                                            date={blog.date}
                                            image={blog.image}
                                            title={blog.heading || blog.title}
                                            description={blog.content?.substring(0, 200) || ""}
                                            author={user}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="no-following">No private blogs yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <h2>My Private Blogs</h2>
                        {myBlogs.length > 0 ? (
                            <div className="myblogs-list">
                                {myBlogs.map((blog) => (
                                    <div key={blog._id} style={{ position: "relative" }}>
                                        <BlogCard
                                            id={blog._id}
                                            category={blog.category}
                                            date={blog.date}
                                            image={blog.image}
                                            title={blog.heading || blog.title}
                                            description={blog.content?.substring(0, 200) || ""}
                                            author={user}
                                        />
                                        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => navigate(`/edit-blog/${blog._id}`)}
                                                style={{ padding: "4px 8px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm("Are you sure you want to delete this blog?")) return;
                                                    const token = localStorage.getItem("token");
                                                    const res = await fetch(`/api/blogs/${blog._id}`, {
                                                        method: "DELETE",
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    });
                                                    if (res.ok) {
                                                        setMyBlogs(myBlogs.filter(b => b._id !== blog._id));
                                                    } else {
                                                        alert("Failed to delete blog.");
                                                    }
                                                }}
                                                style={{ padding: "4px 8px", background: "#fdd", border: "1px solid #f99", borderRadius: 4, cursor: "pointer" }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-following">You haven't written any blogs yet.</p>
                        )}
                    </>
                )}
            </div>

            <div className="profile-section">
                <h2>Following ({following.length})</h2>
                {following.length > 0 ? (
                    <div className="following-list">
                        {following.map((author) => (
                            <div key={author._id} className="following-card">
                                <img src={author.image || "/images/profile1.png"} alt={author.name} />
                                <div className="following-details">
                                    <h3>{author.name}</h3>
                                    <p>{author.bio?.substring(0, 100)}...</p>
                                    <Link to={`/author/${author._id}`} className="view-author">View Profile →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-following">You are not following any authors yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;