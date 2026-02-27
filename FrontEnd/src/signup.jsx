import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Full name is required";

        if (!email) newErrors.email = "Email is required";
        else if (!email.includes("@") || !email.includes("."))
            newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";
        else {
            if (password.length < 8)
                newErrors.password = "Password must be at least 8 characters";
            else if (!/[A-Z]/.test(password))
                newErrors.password =
                    "Password must contain at least one uppercase letter";
            else if (!/[0-9]/.test(password))
                newErrors.password = "Password must contain at least one number";
            else if (!/[@$!%*?&]/.test(password))
                newErrors.password =
                    "Password must contain at least one special character (@$!%*?&)";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const res = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors({ general: data.msg || "Signup failed" });
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (error) {
            setErrors({ general: "Server error. Try again later." });
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-illustration">
                    <img src="../src/assets/signup.png" alt="signup visual" />
                    <h2>Join the Community ✨</h2>
                    <p>Create an account to publish, follow, and connect with authors.</p>
                </div>
                <div className="auth-form-section">
                    <h1 className="auth-title">Sign Up</h1>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                        {errors.general && <p className="error">{errors.general}</p>}
                        <button type="submit">Create Account</button>
                    </form>
                    <div className="auth-divider">
                        <span>OR</span>
                    </div>
                    <div className="auth-socials">
                        <button>Sign Up With Google</button>
                    </div>
                    <p className="auth-switch">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;