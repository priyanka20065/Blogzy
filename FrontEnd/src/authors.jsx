import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthorCard from "./authorCard";
import "./authors.css";

function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/authors", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        navigate("/login");
                        return;
                    }
                    throw new Error("Failed to fetch authors");
                }

                const data = await res.json();
                setAuthors(data.authors || []);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, [navigate]);

    return (
        <div className="Authors-container">
            <h1 className="Authors-heading">Authors</h1>
            <p className="Authors-subtext">
                Meet the creative minds behind the stories on Blogzy.
            </p>

            <div className="Authors-list">
                {loading ? (
                    <p>Loading authors...</p>
                ) : authors.length > 0 ? (
                    authors.map((author) => (
                        <AuthorCard
                            key={author._id}
                            id={author._id}
                            name={author.name}
                            image={author.image || "/assets/author-placeholder.png"}
                            blogs={author.blogsCount || 0}
                            bio={author.bio}
                        />
                    ))
                ) : (
                    <p>No authors found.</p>
                )}
            </div>
        </div>
    );
}

export default Authors;
