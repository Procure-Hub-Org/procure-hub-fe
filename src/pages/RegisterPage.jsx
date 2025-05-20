import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import {
  AppBar,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { isAuthenticated } from "../utils/auth";
import { useTheme } from "@mui/system";
import { trackEvent } from "../utils/plausible";

const RegisterPage = () => {
  const theme = useTheme();

  const isLoggedIn = isAuthenticated();
  if (isLoggedIn) {
    window.location.href = "/";
    return;
  }
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company_name: "",
    phone_number: "",
    address: "",
    company_address: "",
  });

  const [buyerTypes, setBuyerTypes] = useState([]);
  const [selectedBuyerType, setSelectedBuyerType] = useState("");
  const [customBuyerType, setCustomBuyerType] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBuyerTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/buyer-types`
        );
        setBuyerTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch buyer types:", error);
      }
    };

    if (formData.role === "buyer") {
      fetchBuyerTypes();
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target.name, e.target.checked);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
        test: (value) => value === formData.password,
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

    // console.log(`Validating field: ${name}, Value: ${value}, Rules:`, rules);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form is being submitted...");
  
    const registrationData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      company_name: formData.company_name,
      phone_number: formData.phone_number,
      address: formData.address,
      company_address: formData.company_address,
      buyer_type: selectedBuyerType
    };
  
    if (selectedBuyerType === "Other" && customBuyerType) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/buyer-types`,
          { name: customBuyerType }
        );
        registrationData.buyer_type = customBuyerType;
      } catch (error) {
        trackEvent('registration', {
          success: false,
          error: 'buyer_type_creation_failed',
          role: formData.role
        });
        alert("Failed to save custom buyer type");
        return;
      }
    } else if (selectedBuyerType) {
      registrationData.buyer_type = selectedBuyerType;
    }
  
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      trackEvent('registration', {
        success: false,
        error: 'validation_failed',
        role: formData.role,
        fields: Object.keys(newErrors)
      });
      return;
    }
  
    console.log("Sending registration data:", registrationData);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 201) {
        trackEvent('registration', {
          success: true,
          role: formData.role,
          buyer_type: formData.role === 'buyer' ? selectedBuyerType : null
        });
        alert("Registration Successful!");
        console.log("Server Response:", response.data);
        navigate("/login");
      } else {
        trackEvent('registration', {
          success: false,
          error: 'server_error',
          role: formData.role
        });
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
  
      if (error.response && error.response.data.error) {
        if (error.response.data.error === "Email already registered") {
          trackEvent('registration', {
            success: false,
            error: 'email_exists',
            role: formData.role
          });
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email is already registered. Please use a different email.",
          }));
        } else {
          trackEvent('registration', {
            success: false,
            error: 'server_error',
            role: formData.role
          });
          alert("An error occurred during registration: " + error.response.data.error);
        }
      } else {
        trackEvent('registration', {
          success: false,
          error: 'unknown_error',
          role: formData.role
        });
        alert("An error occurred during registration");
      }
    }
  };
  

  const navigate = useNavigate();

  return (
    <Layout>
      <AppBar
        position="static"
        sx={{ background: theme.palette.background.default }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Container maxWidth="sm">
            <Card
              sx={{ width: "100%", padding: 3, boxShadow: 3, borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom align="center">
                  Register
                </Typography>
                <form onSubmit={handleSubmit}>
                  <CustomTextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                  />
                  <CustomTextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
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
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <CustomTextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <CustomTextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                  <CustomSelect
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: "buyer", label: "Buyer" },
                      { value: "seller", label: "Seller" },
                    ]}
                    required
                    error={!!errors.role}
                    helperText={errors.role}
                  />
                  {formData.role === "buyer" && (
                    <>
                      <CustomSelect
                        label="Buyer Type"
                        name="buyer_type"
                        value={selectedBuyerType}
                        onChange={(e) => setSelectedBuyerType(e.target.value)}
                        options={[
                          ...buyerTypes.map((type) => ({
                            label: type.name,
                            value: type.name,
                          })),
                          { label: "Other", value: "Other" },
                        ]}
                      />
                      {selectedBuyerType === "Other" && (
                        <CustomTextField
                          label="Enter Custom Buyer Type"
                          name="custom_buyer_type"
                          value={customBuyerType}
                          onChange={(e) => setCustomBuyerType(e.target.value)}
                          required
                        />
                      )}
                    </>
                  )}

                  <CustomTextField
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.company_name}
                    helperText={errors.company_name}
                  />
                  <CustomTextField
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                  />
                  <CustomTextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                  <CustomTextField
                    label="Company Address"
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!errors.company_address}
                    helperText={errors.company_address}
                  />
                  <PrimaryButton type="submit" fullWidth>
                    Register
                  </PrimaryButton>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </AppBar>
    </Layout>
  );
};

export default RegisterPage;
