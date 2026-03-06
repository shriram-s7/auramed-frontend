import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-color)",
            padding: "1rem"
        }}>
            <div style={{
                marginBottom: "2rem",
                textAlign: "center"
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "var(--primary)",
                    letterSpacing: "0.1em"
                }}>
                    AURA-MED
                </h1>
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    AI Diagnostic System
                </p>
            </div>

            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem"
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Sign In</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Access the diagnostic system
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: "1rem" }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
