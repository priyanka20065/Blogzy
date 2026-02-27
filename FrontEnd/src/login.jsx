import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
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
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrors({
                    general: data.msg || "Login failed",
                });
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
                    <img src="../src/assets/login.png" alt="login visual" />
                    <h2>Welcome Back 👋</h2>
                    <p>
                        Log in to explore blogs, follow authors, and join the conversation.
                    </p>
                </div>
                <div className="auth-form-section">
                    <h1 className="auth-title">Login</h1>
                    <form onSubmit={handleSubmit} className="auth-form">
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
                        <button type="submit">Login</button>
                    </form>
                    <p className="auth-switch">
                        Don’t have an account? <a href="/signup">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;