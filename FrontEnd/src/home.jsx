import "./home.css";
import BlogCard from "./blogCard";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


// Basic Modal Component
function AuthorForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        bio: "",
        image: "",
        instagram: "",
        twitter: "",
        facebook: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // basic validation
        if (!formData.bio.trim()) {
            alert("Please enter a short bio.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Become an Author</h2>
                <p>Tell us a bit about yourself before you start writing.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group author-image-group">
                        <label>Profile Image URL</label>
                        <div className="image-input-container">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                            />
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Bio (Required)</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Short bio..."
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>Instagram (Optional)</label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="@username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Twitter (Optional)</label>
                        <input
                            type="text"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="@username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Facebook (Optional)</label>
                        <input
                            type="text"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="Profile URL"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Proceed to Pay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Home() {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [showAuthorForm, setShowAuthorForm] = useState(false); // Modal state
    const navigate = useNavigate();

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqs = [
        {
            q: "How do I start reading blogs?",
            a: "Simply head to the Blogs page from the navigation menu and explore articles across different categories.",
        },
        {
            q: "Can I publish my own blog?",
            a: "Yes! With our Author Premium plan, you can write, publish, and share your own blogs with the world.",
        },
        {
            q: "Do I need to pay to read blogs?",
            a: "No. Reading blogs is free for everyone. Premium is only required for additional features like publishing or advanced tools.",
        },
    ];

    /* READER PLAN PAYMENT */
    const handleReaderPlanPayment = async () => {
        try {
            console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // 1️⃣ Create order from backend
            const res = await fetch(
                "/api/payment/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: 199, // Reader Plan Amount
                    }),
                }
            );

            const data = await res.json();
            if (!data.success) {
                alert("Order creation failed");
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Blogzy",
                description: "Premium Reader Plan",
                order_id: data.order.id,
                handler: async function (response) {
                    const verifyRes = await fetch(
                        "/api/payment/verify-payment",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                ...response,
                                planType: "reader"
                            }),
                        }
                    );

                    const verifyData = await verifyRes.json();
                    if (!verifyRes.ok || !verifyData.success) {
                        alert("Payment verification failed");
                        return;
                    }

                    localStorage.setItem("user", JSON.stringify(verifyData.user));
                    alert("🎉 You are now a Premium Reader!");
                    setTimeout(() => {
                        // Reload or stay on home to see changes
                        window.location.reload();
                    }, 500);
                },
                theme: { color: "#111827" },
                timeout: 300,
            };

            const rzp = new window.Razorpay(options);
            console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment error");
        }
    };


    /* TRIGGER AUTHOR FORM */
    const initiateWriterFlow = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setShowAuthorForm(true);
    };

    /* WRITER PLAN PAYMENT (Called after form submit) */
    const handleWriterPlanPayment = async (authorData) => {
        try {
            const token = localStorage.getItem("token");

            // Check for upgrade
            const user = JSON.parse(localStorage.getItem("user"));
            let amount = 399;
            if (user && user.isPremium && user.role !== "author") {
                amount = 200; // Upgrade price
            }

            // 1️⃣ Create order from backend
            const res = await fetch(
                "/api/payment/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: amount,
                    }),
                }
            );

            const data = await res.json();
            if (!data.success) {
                alert("Order creation failed");
                return;
            }

            // Close form now
            setShowAuthorForm(false);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // or REACT_APP_
                amount: data.order.amount,
                currency: "INR",
                name: "Blogzy",
                description: "Premium Writer Plan",
                order_id: data.order.id,

                handler: async function (response) {

                    const verifyRes = await fetch(
                        "/api/payment/verify-payment",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                ...response,
                                planType: "writer",
                                authorData: {
                                    bio: authorData.bio,
                                    image: authorData.image,
                                    social: {
                                        instagram: authorData.instagram,
                                        twitter: authorData.twitter,
                                        facebook: authorData.facebook
                                    }
                                }
                            }),
                        }
                    );

                    const verifyData = await verifyRes.json();
                    if (!verifyRes.ok || !verifyData.success) {
                        alert("Payment verification failed");
                        return;
                    }

                    // ✅ update localStorage AFTER backend confirms role update
                    localStorage.setItem("user", JSON.stringify(verifyData.user));

                    alert("🎉 You are now an Author!");

                    // ⏳ tiny delay so React reads updated localStorage
                    setTimeout(() => {
                        navigate("/write");
                    }, 100);
                },

                theme: {
                    color: "#111827",
                },
                timeout: 300,
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment error");
        }
    };

    useEffect(() => {
        const fetchBlogs = async () => {
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
                }
                const data = await res.json();

                if (!data?.blogs || !Array.isArray(data.blogs)) {
                    setFeaturedBlogs([]);
                    return;
                }

                const sorted = data.blogs.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setFeaturedBlogs(sorted.slice(0, 3));
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);
    return (
        <>
            {showAuthorForm && (
                <AuthorForm
                    onClose={() => setShowAuthorForm(false)}
                    onSubmit={handleWriterPlanPayment}
                />
            )}

            <section className="home-hero">
                <div className="home-hero-content">
                    <h1>Welcome to Blogzy</h1>
                    <p>
                        Discover unique stories, insightful articles, and inspiring ideas
                        from authors around the world.
                    </p>
                    <button className="home-btn" onClick={() => navigate("/blogs")}>
                        Explore Blogs
                    </button>
                </div>
            </section>
            <section className="home-featured">
                <h2 className="section-heading">Featured Blogs</h2>

                <div className="home-featured-grid">
                    {featuredBlogs.length > 0 ? (
                        featuredBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                id={blog._id}
                                title={blog.heading}
                                description={blog.content}
                                image={blog.image}
                                category={blog.category}
                                date={blog.date}
                                author={blog.author}
                            />
                        ))
                    ) : (
                        <p>No blogs yet. Start writing!</p>
                    )}
                </div>
            </section>

            <section className="home-faq">
                <h2 className="section-heading">Frequently Asked Questions</h2>
                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openFAQ === index ? "active" : ""}`}
                        >
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                <span>{faq.q}</span>
                                <span className="faq-icon">
                                    {openFAQ === index ? "−" : "+"}
                                </span>
                            </div>
                            <div className="faq-answer">{faq.a}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-pricing">
                <h2 className="section-heading">Choose Your Plan</h2>
                <div className="pricing-grid">
                    {(() => {
                        const user = JSON.parse(localStorage.getItem("user"));
                        const isReader = user && (user.isPremium || user.role === "author");
                        const isWriter = user && user.role === "author";

                        return (
                            <>
                                {/* READER CARD */}
                                <div
                                    className="pricing-card"
                                    style={isReader ? { opacity: 0.5, pointerEvents: "none" } : {}}
                                >
                                    <h3>Premium Reader</h3>
                                    <p className="price">₹199/month</p>
                                    <ul>
                                        <li>✔ Unlock new themes</li>
                                        <li>✔ Bookmark favorite blogs</li>
                                        <li>✔ Comment on posts</li>
                                    </ul>
                                    <button
                                        className="home-btn"
                                        onClick={handleReaderPlanPayment}
                                        disabled={isReader}
                                    >
                                        {isReader ? "Active Plan" : "Get Reader Plan"}
                                    </button>
                                </div>

                                {/* WRITER CARD */}
                                <div
                                    className="pricing-card premium"
                                    style={isWriter ? { opacity: 0.5, pointerEvents: "none" } : {}}
                                >
                                    <h3>Premium Writer</h3>
                                    {user && user.isPremium && !isWriter ? (
                                        <p className="price">₹200 (Upgrade)</p>
                                    ) : (
                                        <p className="price">₹399/month</p>
                                    )}
                                    <ul>
                                        <li>✔ Publish your blogs</li>
                                        <li>✔ Access to reader features</li>
                                        <li>✔ Track your monthly followers</li>
                                    </ul>
                                    <button
                                        className="home-btn"
                                        onClick={initiateWriterFlow}
                                        disabled={isWriter}
                                    >
                                        {isWriter ? "Active Plan" : "Get Writer Plan"}
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </section>

            <div className="home-write" onClick={() => navigate("/write")}>
                <span>✍ Write Your Blog</span>
            </div>
        </>
    );
}

export default Home;