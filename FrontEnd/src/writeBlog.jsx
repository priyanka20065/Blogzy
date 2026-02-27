import React, { useState, useEffect } from "react";
import "./writeBlog.css";

function WriteBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [image, setImage] = useState("");
    const [user, setUser] = useState(null);
    const [authorId, setAuthorId] = useState("");

    useEffect(() => {
        const userSession = localStorage.getItem("user");
        if (!userSession) return;

        const u = JSON.parse(userSession);
        setUser(u);
        if (!u) return;

        if (u.role === "author") {
            setAuthorId(u._id || u.id); // try both just in case
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        if (!user || user.role !== "author") {
            alert("❌ Only authors can write blogs!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("heading", title);
            formData.append("content", content);
            formData.append("category", category);
            formData.append("author", authorId);
            formData.append("date", new Date().toISOString());

            if (image) {
                formData.append("image", image); // This is now a File object
            }

            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Something went wrong!");
                return;
            }

            alert("✅ Blog published!");
            setTitle("");
            setContent("");
            setImage(null);
            setCategory("General");
            // Reset file input
            e.target.reset();
        } catch (error) {
            alert("❌ Error publishing blog!");
            console.error(error);
        }
    };

    return (
        <div className="writeblog-container">
            <div className="writeblog-card">
                <h1 className="writeblog-heading">✍️ Create a New Blog</h1>
                <p className="writeblog-subtext">
                    Writing as: <strong>{user?.name}</strong>
                </p>
                <form onSubmit={handleSubmit} className="writeblog-form">
                    <div className="form-group">
                        <label>Blog Title</label>
                        <input
                            type="text"
                            placeholder="Enter a catchy title..."
                            className="writeblog-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="writeblog-input"
                            >
                                <option>General</option>
                                <option>Political</option>
                                <option>Sports</option>
                                <option>Art</option>
                            </select>
                        </div>

                        <div className="form-group flex-2">
                            <label>Cover Image (Optional)</label>
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="writeblog-file-input"
                                    id="blog-image"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <label htmlFor="blog-image" className="file-label">
                                    {image ? `📁 ${image.name}` : "📂 Choose an image..."}
                                </label>
                            </div>
                        </div>
                    </div>

                    {image && (
                        <div className="image-preview-container">
                            <p>Image Preview:</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Blog Cover"
                                className="writeblog-preview"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Blog Content</label>
                        <textarea
                            placeholder="Once upon a time..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="writeblog-textarea"
                            required
                        />
                    </div>

                    <button type="submit" className="writeblog-btn">
                        🚀 Publish Blog
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WriteBlog;