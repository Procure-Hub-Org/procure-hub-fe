import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { isAuthenticated } from "../utils/auth";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomTextField from "../components/Input/TextField";
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
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    for (let rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
  };

  const validationRules = {
    email: [
      { test: (value) => !!value, message: "Email name is required" },
      {
        test: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: "Please enter a valid email",
      },
      {
        test: (value) => value.length <= 50,
        message: "Email cannot exceed 50 characters",
      },
      {
        test: (value) => /^[a-zA-Z]/.test(value),
        message: "Email must start with a letter",
      },
    ],
    password: [
      { test: (value) => !!value, message: "Password is required" },
      {
        test: (value) => value.length >= 8,
        message: "Password must be at least 8 characters long",
      },
      {
        test: (value) => /[A-Z]/.test(value),
        message: "Password must contain at least one uppercase letter",
      },
      {
        test: (value) => /\d/.test(value),
        message: "Password must contain at least one number",
      },
      {
        test: (value) => /[\W_]/.test(value),
        message: "Password must contain at least one special character",
      },
    ],
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
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
          <form onSubmit={handleSubmit} noValidate>
            <CustomTextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
            <CustomTextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
            />
            <PrimaryButton type="submit">Login</PrimaryButton>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
