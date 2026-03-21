import React, { useState, useEffect } from "react";
import "./writeBlog.css";


function WriteBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    // const [image, setImage] = useState("");
    const [user, setUser] = useState(null);
    const [authorId, setAuthorId] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const userSession = localStorage.getItem("user");
        if (!userSession) return;

        const u = JSON.parse(userSession);
        setUser(u);
        if (!u) return;
        setAuthorId(u._id || u.id); // Always set authorId for all users
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('DEBUG:', { title, content, imageUrl });
        if (!title.trim() || !content.trim() || !imageUrl.trim()) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        if (!user) {
            alert("❌ You must be logged in to write blogs!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const blogData = {
                heading: title,
                content,
                category,
                author: authorId,
                date: new Date().toISOString(),
                image: imageUrl,
                visibility: user && user.role === "author" ? visibility : "private",
            };

            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(blogData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || "Something went wrong!");
                return;
            }

            alert("✅ Blog published!");
            setTitle("");
            setContent("");
            setCategory("General");
            setVisibility("public");
            e.target.reset();
        } catch (error) {
            alert("❌ Error publishing blog!");
            console.error(error);
        }
    };

    return (
        <div className="writeblog-container">
            <form onSubmit={handleSubmit} className="writeblog-form">
                <div className="form-group">
                    <label>Title <span style={{color: 'red'}}>*</span></label>
                    <input
                        type="text"
                        className="writeblog-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter blog title"
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
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Image URL <span style={{color: 'red'}}>*</span></label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="writeblog-input"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                            />
                        </div>
                        {imageUrl && (
                            <div className="image-preview-container">
                                <p>Image Preview:</p>
                                <img
                                    src={imageUrl}
                                    alt="Blog Cover"
                                    className="writeblog-preview"
                                    style={{maxWidth: '100%', maxHeight: '200px'}}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Blog Content</label>
                    <textarea
                        placeholder="Once upon a time..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="writeblog-textarea"
                    />
                </div>

                {user && user.role === "author" && (
                    <div className="form-group">
                        <label>Visibility</label>
                        <select
                            value={visibility}
                            onChange={e => setVisibility(e.target.value)}
                            className="writeblog-input"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="writeblog-btn">
                    🚀 Publish Blog
                </button>
            </form>
        </div>
    );
}

export default WriteBlog;