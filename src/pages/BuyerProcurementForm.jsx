import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Container,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
// import axios from "axios";
import Layout from "../components/Layout/Layout";
import OutlinedButton from "../components/Button/OutlinedButton.jsx";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
// ikonice
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";

// mock data
const mockFormData = {
    id: 16,
    title: "Laptop Purchase",
    description: "Procurement for office laptops",
    location: "Sarajevo",
    deadline: "2025-04-30",
    budgetMin: 5000,
    budgetMax: 10000,
    category: "IT Equipment",
    status: "draft",
    items: [
        { title: "Laptop", description: "Dell XPS 13", quantity: 10 },
        { title: "Docking Station", description: "USB-C compatible", quantity: 10 },
    ],
    requirements: [
        { type: "Warranty", description: "At least 2 years" },
        { type: "Delivery", description: "Within 2 weeks" },
    ],
};

// import { useTheme } from "@mui/system";

const ProcurementForm = () => {
    const { id } = useParams(); // Preuzimanje `id` iz parametara rute
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        budgetMin: "",
        budgetMax: "",
        deadline: "",
        category: "",
        status: "",
        items: [{ title: "", description: "", quantity: 1 }],
        requirements: [{ type: "", description: "" }],
    });

    const navigate = useNavigate();

    // Load if id exists
    useEffect(() => {
        if (id == mockFormData.id) {
            /*
            const fetchFormData = async () => {
                try {
                    const response = await axios.get(`/api/form-data/${id}`); // Preuzimanje podataka za editovanje
                    if (response.status === 200) {
                        setFormData(response.data); // Popuniti formu sa podacima iz baze
                    } else {
                        console.error("Failed to fetch data", response);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchFormData();

             */
            setFormData(mockFormData);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...formData.items];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, items: updated }));
    };

    const handleRequirementChange = (index, field, value) => {
        const updated = [...formData.requirements];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, requirements: updated }));
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { title: "", description: "", quantity: 1 }],
        }));
    };

    const addRequirement = () => {
        setFormData((prev) => ({
            ...prev,
            requirements: [...prev.requirements, { type: "", description: "" }],
        }));
    };

    const removeItem = (index) => {
        const updated = [...formData.items];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, items: updated }));
    };

    const removeRequirement = (index) => {
        const updated = [...formData.requirements];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, requirements: updated }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted form:", formData);
    };

    const handleSaveDraft = () => {
        console.log('Close preview');
        navigate('/buyer-procurement-requests')
    }

    return (
        <Layout>
            <AppBar position="static">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                    }}
                >
                    <Container maxWidth="sm">
                        <Card sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom align="center">
                                    Create Procurement
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Deadline"
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Budget Min"
                                        name="budgetMin"
                                        type="number"
                                        value={formData.budgetMin}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Budget Max"
                                        name="budgetMax"
                                        type="number"
                                        value={formData.budgetMax}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        displayEmpty
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Category
                                        </MenuItem>
                                        <MenuItem value="IT Equipment">IT Equipment</MenuItem>
                                        <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                                    </Select>

                                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                                        Items
                                    </Typography>
                                    {formData.items.map((item, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <TextField
                                                label="Item Title"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleItemChange(index, "title", e.target.value)
                                                }
                                                fullWidth
                                                required
                                                sx={{ mb: 1 }}
                                            />
                                            <TextField
                                                label="Item Description"
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleItemChange(index, "description", e.target.value)
                                                }
                                                fullWidth
                                                required
                                                sx={{ mb: 1 }}
                                            />
                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(index, "quantity", e.target.value)
                                                }
                                                fullWidth
                                                required
                                            />
                                            {formData.items.length > 1 && (
                                                <SecondaryButton
                                                    onClick={() => removeItem(index)}
                                                    fullWidth
                                                >
                                                    Remove Item
                                                </SecondaryButton>
                                            )}
                                        </Box>
                                    ))}
                                    <OutlinedButton onClick={addItem} fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        + Add Item
                                    </OutlinedButton>

                                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                                        Requirements
                                    </Typography>
                                    {formData.requirements.map((req, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <TextField
                                                label="Requirement Type"
                                                value={req.type}
                                                onChange={(e) =>
                                                    handleRequirementChange(index, "type", e.target.value)
                                                }
                                                fullWidth
                                                required
                                                sx={{ mb: 1 }}
                                            />
                                            <TextField
                                                label="Requirement Description"
                                                value={req.description}
                                                onChange={(e) =>
                                                    handleRequirementChange(index, "description", e.target.value)
                                                }
                                                fullWidth
                                                required
                                            />
                                            {formData.requirements.length > 1 && (
                                                <SecondaryButton
                                                    onClick={() => removeRequirement(index)}
                                                    fullWidth
                                                >
                                                    Remove Requirement
                                                </SecondaryButton>
                                            )}
                                        </Box>
                                    ))}
                                    <OutlinedButton
                                        onClick={addRequirement}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        + Add Requirement
                                    </OutlinedButton>

                                    <PrimaryButton type="save-draft" onClick={handleSaveDraft} startIcon={<SaveIcon />}>
                                        Save Draft
                                    </PrimaryButton>

                                    <PrimaryButton type="submit" fullWidth startIcon={<SendIcon />}>
                                        Submit Procurement
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

export default ProcurementForm;