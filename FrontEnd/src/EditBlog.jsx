
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

    useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.blog);
        setTitle(data.blog.heading || data.blog.title || "");
        setContent(data.blog.content || "");
        setCategory(data.blog.category || "General");
        setLoading(false);
      } catch (err) {
        setError("Could not load blog");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ heading: title, content, category }),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      alert("Blog updated!");
      navigate("/profile");
    } catch (err) {
      setError("Could not update blog");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: 16 }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: "100%", padding: 8, minHeight: 120 }}
            required
          />
        </div>
        <button type="submit" style={{ padding: "8px 24px" }}>Update Blog</button>
      </form>
    </div>
  );
}

export default EditBlog;
