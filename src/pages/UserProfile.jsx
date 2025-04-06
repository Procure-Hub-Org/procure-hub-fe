import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomTextField from "../components/Input/TextField";
import { AppBar, IconButton} from "@mui/material";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import { useNavigate } from "react-router-dom"; 

function UserProfile() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    company_name: "",
    phone_number: "",
    address: "",
    company_address: "",
    bio: "",
    profile_picture: null,
    company_picture: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const fetchUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await response.json();
      setUserData(resData.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2️⃣ Then use it inside useEffect
  useEffect(() => {
    fetchUserData();
  }, []);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    console.log(name);
    console.log(files);
    // setUserData({
    //   ...userData,
    //   [name]: files[0],
    // });
    const formData = new FormData();
    formData.append(name, files[0]); // the file from input
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/user/profile/update",
        {
          method: "PUT",
          body: formData,
          // Do NOT set Content-Type to multipart/form-data manually! Browser will do it
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 raw token goes here
            // ⚠️ Don't set Content-Type manually, let the browser handle it with FormData
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Upload success:", result);
        fetchUserData();
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const validationRules = {
    first_name: [
      { test: (value) => !!value, message: "First name is required" },
      {
        test: (value) => value.length >= 2,
        message: "First name must be at least 2 characters long",
      },
      {
        test: (value) => /^[a-zA-Z]+$/.test(value),
        message: "First name can only contain letters",
      },
      {
        test: (value) => /^[A-Z]/.test(value),
        message: "First name must start with an uppercase letter",
      },
      {
        test: (value) => value.length <= 20,
        message: "First name cannot exceed 20 characters",
      },
    ],
    last_name: [
      { test: (value) => !!value, message: "Last name is required" },
      {
        test: (value) => value.length >= 2,
        message: "Last name must be at least 2 characters long",
      },
      {
        test: (value) => /^[a-zA-Z]+$/.test(value),
        message: "Last name can only contain letters",
      },
      {
        test: (value) => /^[A-Z]/.test(value),
        message: "Last name must start with an uppercase letter",
      },
      {
        test: (value) => value.length <= 20,
        message: "Last name cannot exceed 20 characters",
      },
    ],
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
    confirmPassword: [
      {
        test: (value) => value === userData.password,
        message: "Passwords do not match",
      },
    ],
    role: [
      {
        test: (value) => ["buyer", "seller"].includes(value),
        message: "Role must be either buyer or seller",
      },
    ],
    address: [
      { test: (value) => !!value, message: "Address is required" },
      {
        test: (value) => value.length >= 5,
        message: "Address must be at least 5 characters long",
      },
      {
        test: (value) => value.length <= 100,
        message: "Address cannot exceed 100 characters",
      },
      {
        test: (value) => /^[A-Za-z0-9\s,.-]+$/.test(value),
        message:
          "Address can only contain letters, numbers, spaces, and certain special characters",
      },
    ],
    company_name: [
      { test: (value) => !!value, message: "Company name is required" },
      {
        test: (value) => value.length >= 2,
        message: "Company name must be at least 2 characters long",
      },
      {
        test: (value) => value.length <= 50,
        message: "Company name cannot exceed 50 characters",
      },
      {
        test: (value) => /^[A-Za-z0-9\s,.-]+$/.test(value),
        message:
          "Company name can only contain letters, numbers, spaces, and certain special characters",
      },
    ],
    company_address: [
      { test: (value) => !!value, message: "Company address is required" },
      {
        test: (value) => value.length <= 100,
        message: "Company address cannot exceed 100 characters",
      },
      {
        test: (value) => /^[A-Za-z0-9\s,.-]+$/.test(value),
        message:
          "Company address can only contain letters, numbers, spaces, and certain special characters",
      },
    ],
    phone_number: [
      { test: (value) => !!value, message: "Phone number is required" },
      {
        test: (value) => /^\+(\d{1,3})\s?(\d{1,15})(\s?\d{1,15})*$/.test(value),
        message: "Please enter a valid phone number",
      },
    ],
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];

    if (!Array.isArray(rules)) {
      console.error(`Validation rules not found for field: ${name}`);
      return "";
    }

    for (let rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const navigate = useNavigate();
    const handleBackClick = () => {
      navigate(-1);
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <AppBar position="static" sx={{ background: "#14110F" }}>
       <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ paddingRight: 1 }}>
          <ArrowBackIcon />
        </IconButton>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ width: "100%", padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              User Profile
            </Typography>
            {true && (
              <form onSubmit={handleSubmit}>
                <CustomTextField
                  label="First Name"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                />
                <CustomTextField
                  label="Last Name"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                />
                <CustomTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
                {/* <CustomTextField
                  label="Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                /> */}
                <CustomTextField
                  label="Role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // required
                  // error={!!errors.role}
                  // helperText={errors.role}
                  disabled={true}
                />
                <CustomTextField
                  label="Company Name"
                  name="company_name"
                  value={userData.company_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.company_name}
                  helperText={errors.company_name}
                />
                <CustomTextField
                  label="Phone Number"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                />
                <CustomTextField
                  label="Address"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.address}
                  helperText={errors.address}
                />
                <CustomTextField
                  label="Company Address"
                  name="company_address"
                  value={userData.company_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!errors.company_address}
                  helperText={errors.company_address}
                />
                <CustomTextField
                  label="Bio"
                  name="bio"
                  value={userData.bio !== null ? userData.bio : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.bio}
                  helperText={errors.bio}
                  multiline
                  rows={4}
                />

                <div>
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    name="profile_picture"
                    onChange={handleFileChange}
                  />
                  <Box
                    component="img"
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="Profile picture."
                    src={`http://localhost:3000/${userData.profile_picture}`}
                  />
                </div>
                <div>
                  <label>Company Logo</label>
                  <input
                    type="file"
                    name="company_logo"
                    onChange={handleFileChange}
                  />
                  <Box
                    component="img"
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="Company logo."
                    src={`http://localhost:3000/${userData.company_logo}`}
                  />
                </div>
                <PrimaryButton type="submit" fullWidth>
                  Save Profile Info
                </PrimaryButton>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
    </AppBar>
  );
}

export default UserProfile;
