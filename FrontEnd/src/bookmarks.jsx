
import { useEffect, useState } from "react";
import BlogCard from "./blogCard";
import "./blogs.css"; // Reuse blogs css for grid layout

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/user/bookmarks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setBookmarks(data.bookmarks);
                } else {
                    console.error("Failed to fetch bookmarks");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    return (
        <>
            <h1 className="Blogs-heading">BOOKMARKS</h1>
            <p className="Blogs-subtext">Your curated list of favorite reads.</p>

            <div className="blogs-grid">
                {loading ? (
                    <p>Loading bookmarks...</p>
                ) : bookmarks.length > 0 ? (
                    bookmarks.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            id={blog._id}
                            category={blog.category?.toUpperCase()}
                            image={blog.image}
                            title={blog.heading}
                            description={blog.content}
                            author={blog.author}
                            date={blog.date}
                        />
                    ))
                ) : (
                    <p>No bookmarks yet. Go explore and save some blogs!</p>
                )}
            </div>
        </>
    );
}

export default Bookmarks;