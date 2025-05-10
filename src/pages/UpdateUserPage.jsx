import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomSelect from "../components/Input/DropdownSelect";
import { Container, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    status: "", 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const userData = response.data;
          setFormData({
            role: userData.role || "",
            status: userData.status || "",
          });
        } else {
          setInitialLoadError(`Failed to load user data: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setInitialLoadError('An error occurred while fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validationRules = {
    role: [
      { test: value => !!value, message: "Role is required" },
      { test: value => ["buyer", "seller", "admin"].includes(value), message: "Role must be either buyer, seller, or admin" },
    ],
    status: [
      { test: value => !!value, message: "Status is required" },
      { test: value => ["active", "pending", "suspended"].includes(value), message: "Status must be one of: active, pending, suspended" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const updateData = {
      role: formData.role,
      status: formData.status,
    };

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success("User Role and Status Updated Successfully!");
        console.log('Server Response:', response.data);
        navigate('/admin/users');
      } else {
        toast.error('User update failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error during user update:', error);
      toast.error('An error occurred during user update');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (initialLoadError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{initialLoadError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <ToastContainer position ="top-right" autoClose={5000}/>
      <Container maxWidth="sm">
        <Card sx={{ width: "100%", padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">Update</Typography>
            <form onSubmit={handleSubmit}>
              <CustomSelect
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  { value: "", label: "Select Role" },
                  { value: "buyer", label: "Buyer" },
                  { value: "seller", label: "Seller" },
                  { value: "admin", label: "Admin" },
                ]}
                required
                error={!!errors.role}
                helperText={errors.role}
              />
              <CustomSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  { value: "active", label: "Active" },
                  { value: "pending", label: "Pending" },
                  { value: "suspended", label: "Suspended" },
                ]}
                required
                error={!!errors.status}
                helperText={errors.status}
              />
              <PrimaryButton type="submit" fullWidth>Save</PrimaryButton>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UpdateUserPage;