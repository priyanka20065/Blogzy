import { useParams } from "react-router-dom";
import "./blogs.css";
import BlogCard from "./blogCard";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

function Blog() {
    const { category, name } = useParams();
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        async function getBlogs() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/blogs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        navigate("/login");
                        return;
                    }
                    throw new Error("UnAuthorized");
                    return;
                }
                const data = await res.json();

                setAllBlogs(data.blogs);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        getBlogs();
    }, []);

    let filteredBlogs = allBlogs;
    if (category) {
        filteredBlogs = filteredBlogs.filter(
            (b) => b.category?.toLowerCase() === category.toLowerCase()
        );
    }
    if (name) {
        filteredBlogs = filteredBlogs.filter(
            (b) => b.author?.name?.toLowerCase() === name.toLowerCase()
        );
    }

    return (
        <>
            <h1 className="Blogs-heading">BLOGS</h1>
            <p className="Blogs-subtext">
                {category
                    ? `Explore the latest ${category} articles and stories.`
                    : name
                        ? `Read all blogs written by ${name}.`
                        : "Where ideas take shape and words find meaning."}
            </p>

            <div className="blogs-grid">
                {loading ? (
                    <p>Loading blogs...</p>
                ) : filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
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
                    <p>No blogs found.</p>
                )}
            </div>
        </>
    );
}

export default Blog;