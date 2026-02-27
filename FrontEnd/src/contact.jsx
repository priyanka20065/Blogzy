import { useState } from "react";
import "./contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", msg: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: "success", msg: "Message sent successfully!" });
                setFormData({ name: "", message: "" });
            } else {
                setStatus({ type: "error", msg: data.msg || "Something went wrong." });
            }
        } catch (error) {
            setStatus({ type: "error", msg: "Failed to connect to server." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="contact-container">
                <h1 className="contact-heading">Get in Touch</h1>
                <p className="contact-subtext">
                    We’d love to hear from you. Choose a way below or send us a message.
                </p>

                <div className="contact-tiles">
                    <div className="contact-tile">
                        <span className="contact-icon">📧</span>
                        <h3>Email Us</h3>
                        <p>blogzy24x7@gmail.com</p>
                    </div>

                    <div className="contact-tile">
                        <span className="contact-icon">📞</span>
                        <h3>Call Us</h3>
                        <p>+91 8729081507</p>
                    </div>

                    <div className="contact-tile">
                        <span className="contact-icon">📍</span>
                        <h3>Visit Us</h3>
                        <p>Chitkara University</p>
                    </div>
                </div>

                <div className="contact-form-container">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            rows="5"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                    {status.msg && (
                        <p className={`contact-status ${status.type}`}>{status.msg}</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Contact;