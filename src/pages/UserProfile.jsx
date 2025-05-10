import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import { Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isBuyer } from "../utils/auth";
import axios from "axios";
import BasicButton from "../components/Button/BasicButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Layout from "../components/Layout/Layout";
import "../styles/UserProfile.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProfile() {
  const isLoggedIn = isAuthenticated();
  if (!isLoggedIn) {
    ``;
    window.location.href = "/login";
    return;
  }
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

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
    profile_picture: "",
    company_picture: "",
  });

  const [buyerType, setBuyerType] = useState("");
  const [customBuyerType, setCustomBuyerType] = useState("");
  const [selectedBuyerType, setSelectedBuyerType] = useState("");
  const [buyerTypes, setBuyerTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isBuyer()) {
    useEffect(() => {
      const fetchBuyerTypes = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/buyer-types`
          );
          setBuyerTypes(response.data);
        } catch (error) {
          console.error("Error fetching buyer types:", error);
        }
      };
      fetchBuyerTypes();
    }, []);
  }

  const fetchUserData = async () => {
    console.log("fetcha");
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await response.json();
      setUserData(resData.user);
      if (resData.buyer_type)
        setBuyerType(resData.buyer_type.name);

    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
      console.log("NE fetcha");
    }
  };

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
    console.log(e.target.files);
    const { name, files } = e.target;
    const formData = new FormData();
    formData.append(name, files[0]);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profile/update`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
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

  const handleBuyerTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedBuyerType(selectedValue);
    setBuyerType(selectedValue);
    if (selectedValue === "Other") {
      setBuyerType("");
    }
  };

  const handleCustomBuyerTypeChange = (e) => {
    setCustomBuyerType(e.target.value);
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
    console.log(userData);

    const userDataToSend = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      address: userData.address,
      company_name: userData.company_name,
      bio: userData.bio,
      company_address: userData.company_address,
      buyer_type_id: null,
    };

    if (selectedBuyerType === "Other" && customBuyerType) {
      console.log("uslo", customBuyerType);
      try {
        let buyerTypeId;
        const createResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/buyer-types`,
          { name: customBuyerType }
        );
        buyerTypeId = createResponse.data.id;

        userDataToSend.buyer_type_id = buyerTypeId;
      } catch (error) {
        toast.error("Failed to save or update custom buyer type");
        return;
      }
    } else if (selectedBuyerType) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/buyer-types`
        );
        console.log("Response data:", response.data);
        if (response.data.length > 0) {
          const buyerType = response.data.find(
            (type) => type.name === selectedBuyerType
          );
          if (buyerType) {
            userDataToSend.buyer_type_id = buyerType.id;
          }
        }
      } catch (error) {
        toast.error("Failed to fetch buyer type");
        return;
      }
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/buyer-types?name=${buyerType}`
        );
        if (response.data.length > 0) {
          userDataToSend.buyer_type_id = response.data[0].id;
        }
      } catch (error) {
        toast.error("Failed to fetch buyer type");
        return;
      }
    }

    console.log("Za slanje", userDataToSend);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/profile/update`,
        userDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");

        console.log("Update Response:", response.data);
      } else {
        toast.error("Profile update failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      if (error.response && error.response.data.error) {
        toast.error("Update failed: " + error.response.data.error);
      } else {
        toast.error("An unexpected error occurred while updating profile.");
      }
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card
        sx={{
          width: "50%",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div className="flex-item">
                <div className="flex-column-center">
                  <p>Profile Picture</p>
                  {!isLoading && (
                    <Box
                      component="img"
                      sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="Profile picture."
                      src={`${userData.profile_picture_url}`}
                    />
                  )}
                  <PrimaryButton
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload new
                    <input
                      name="profile_picture"
                      type="file"
                      className="visually-hidden-input"
                      onChange={handleFileChange}
                    />
                  </PrimaryButton>
                </div>
              </div>

              <div className="flex-item">
                <div className="flex-column-center">
                  <p>Company Logo</p>
                  {!isLoading && (
                    <Box
                      component="img"
                      sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="Company logo."
                      src={`${userData.company_logo_url}`}
                    />
                  )}
                  <PrimaryButton
                    startIcon={<CloudUploadIcon />}
                    component="label"
                  >
                    Upload new
                    <input
                      name="company_logo"
                      type="file"
                      className="visually-hidden-input"
                      onChange={handleFileChange}
                    />
                  </PrimaryButton>
                </div>
              </div>

              <div className="flex-item">
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
              </div>

              <div className="flex-item">
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
              </div>
              <div className="flex-item">
                <CustomTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                />
              </div>
              <div className="flex-item">
                <CustomTextField
                  label="Role"
                  name="role"
                  value={
                    // role first letter uppercase, unclean to do it here...
                    userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                />
              </div>
              <div className="flex-item">
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
              </div>
              <div className="flex-item">
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
              </div>
              <div className="flex-item">
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
              </div>
              <div className="flex-item">
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
              </div>
            </div>

            {isBuyer() && (
              <>
                <CustomSelect
                  label="Buyer Type"
                  name="buyer_type"
                  value={buyerType}
                  onChange={handleBuyerTypeChange}
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
                    onChange={handleCustomBuyerTypeChange}
                    required
                  />
                )}
              </>
            )}

            <CustomTextField
              label="Bio"
              name="bio"
              value={userData.bio !== null ? userData.bio : ""}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <PrimaryButton type="submit" fullWidth>
              Save Profile Info
            </PrimaryButton>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}

export default UserProfile;
