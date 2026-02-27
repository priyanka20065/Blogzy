import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">Blogzy</Link>
                    <p className="footer-tagline">
                        Bringing the best stories, insights, and perspectives directly to you.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="links-column">
                        <h3>Explore</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/blogs">All Blogs</Link></li>
                            <li><Link to="/authors">Authors</Link></li>
                        </ul>
                    </div>
                    <div className="links-column">
                        <h3>Support</h3>
                        <ul>
                            <li><Link to="/contact">Get in Touch</Link></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-newsletter">
                    <h3>Stay Updated</h3>
                    <p>Subscribe to get the latest articles in your inbox.</p>
                    <div className="footer-form">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={subscribed}
                            />
                            {error && <p className="error-text">{error}</p>}
                        </div>
                        <button className="subscribe-btn">SUBSCRIBE</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Blogzy. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;