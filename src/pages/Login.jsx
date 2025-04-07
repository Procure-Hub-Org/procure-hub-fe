import React, { useState } from "react";
import "../styles/Login.css";  
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { isAuthenticated } from "../utils/auth"; 

const Login = () => {
    const isLoggedIn = isAuthenticated();
    if (isLoggedIn) {
        window.location.href = "/";
        return;
    }

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Unesite email i lozinku.");
            return;
        }

        setError(""); 

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);

                if (data.user.role === "admin") {
                    navigate("/admin"); 
                } else {
                    navigate("/profile"); 
                }
            } else {
                if (response.status === 401) {
                    setError("Pogrešan email ili lozinka.");
                } else if (response.status === 403) {
                    setError("Vaš nalog je suspendovan.");
                } else {
                    setError("Greška prilikom prijave.");
                }
            }
        } catch (err) {
            setError("Greška na serveru. Pokušajte ponovo kasnije.");
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="login-container">
                <div className="login-box">
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
