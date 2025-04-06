import React, { useState } from "react";
import "../styles/Login.css";  
import {Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import HomeIcon from "@mui/icons-material/Home";


const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            //console.log(data.token)
            navigate("/profile"); 
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
    <div className="login-container">
         <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%" ,paddingInline:"50px"}}>
          <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton edge="start" color="inherit" onClick={handleHomeClick} sx={{ mr: 2 }}>
                    <HomeIcon />
            </IconButton>
        </Box>
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
);
};




export default Login;
