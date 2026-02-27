import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./blogCard.css";

function BlogCard({ id, category, date, image, title, description, author }) {
    const navigate = useNavigate();

    const calculateReadTime = (text) => {
        const wordsPerMinute = 200;
        const words = text
            .trim()
            .split(" ")
            .filter((word) => word !== "").length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} Min`;
    };

    const truncateDescription = (text) => {
        if (text.length > 200) {
            return text.substring(0, 200) + "... ";
        }
        return text;
    };

    const [isBookmarked, setIsBookmarked] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token && id) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.bookmarks && user.bookmarks.includes(id)) {
                setIsBookmarked(true);
            } else {
                setIsBookmarked(false);
            }
        } else {
            setIsBookmarked(false);
        }
    }, [id, token]);

    const handleBookmark = async () => {
        if (!token) {
            alert("Please login to bookmark");
            navigate("/login");
            return;
        }

        if (!id) {
            console.error("No blog ID provided for bookmarking");
            return;
        }

        console.log(`[BlogCard] Sending bookmark request for blog: ${id}`);
        try {
            const res = await fetch(`/api/user/bookmark/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`[BlogCard] Bookmark status updated: ${data.msg}`);
                setIsBookmarked(!isBookmarked);

                // Update local storage to reflect changes immediately
                let user = JSON.parse(localStorage.getItem("user"));
                if (data.bookmarks) {
                    user.bookmarks = data.bookmarks;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            } else {
                const errorData = await res.json();
                console.error(`[BlogCard] Bookmarking failed:`, errorData);
                alert(`Failed to update bookmark: ${errorData.msg || "Unknown error"}`);
            }
        } catch (error) {
            console.error("[BlogCard] Network error bookmarking blog:", error);
            alert("Something went wrong while bookmarking. Please try again.");
        }
    };

    return (
        <div className="blog-card">
            <div className="blog-card-header">
                <span className="date">{new Date(date).toLocaleDateString()}</span>
                <span className="category">{category}</span>
                {(() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user && (user.isPremium || user.role === "author")) {
                        return (
                            <button
                                onClick={handleBookmark}
                                className={`bookmark-btn ${isBookmarked ? "active" : ""}`}
                                title={isBookmarked ? "Remove Bookmark" : "Save for Later"}
                            >
                                {isBookmarked ? "★" : "☆"}
                            </button>
                        );
                    }
                    return null;
                })()}
            </div>

            <div className="blog-image-container">
                <img className="blog-image" src={image} alt={title} />
            </div>

            <div className="blog-content">
                <h2 className="blog-title">{title}</h2>
                <p className="blog-description">
                    {truncateDescription(description)}
                    {description.length > 200 && (
                        <span
                            className="read-more"
                            onClick={() => {
                                if (id) navigate("/blogs/detail/" + id);
                                else console.warn("Blog ID is undefined!");
                            }}
                        >
                            Read More
                        </span>
                    )}
                </p>

                <div className="blog-footer">
                    <span>
                        <strong>By </strong>
                        {author ? (
                            <Link to={`/author/${author._id}`}>{author.name}</Link>
                        ) : (
                            "Unknown Author"
                        )}
                    </span>
                    <span>
                        <strong>Read </strong>
                        {calculateReadTime(description)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;