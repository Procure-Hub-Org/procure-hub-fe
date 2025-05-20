import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { isAuthenticated } from "../utils/auth";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomInput from "../components/Input/CustomInput";  
import { trackEvent } from "../utils/plausible";

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
      setError("Enter email and password.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("id", data.user.id);
        
        // Track successful login
        trackEvent('login', {
          success: true,
          role: data.user.role
        });

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Track failed login attempt
        trackEvent('login', {
          success: false,
          error: response.status === 401 ? 'invalid_credentials' : 'account_suspended'
        });

        if (response.status === 401) {
          setError("Invalid email or password.");
        } else if (response.status === 403) {
          setError("Your account is suspended.");
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } catch (err) {
      // Track login error
      trackEvent('login', {
        success: false,
        error: 'system_error'
      });
      
      setError("An error occurred. Please try again.");
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
            <PrimaryButton type="submit">Login</PrimaryButton>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
