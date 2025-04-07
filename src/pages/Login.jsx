import React, { useState } from "react";
import "../styles/Login.css";  
import {Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import HomeIcon from "@mui/icons-material/Home";
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

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role)
            localStorage.setItem("id", data.user.id)
            //console.log(data.token)
            if (data.user.role === "admin") {
                navigate("/admin"); 
            } else {
                navigate("/profile"); 
            }
        } else {
            setError(data.message);
        }
    };
    const handleBackClick = () => {
        navigate(-1); 
    };
    const handleHomeClick = () => {
        navigate("/"); 
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
