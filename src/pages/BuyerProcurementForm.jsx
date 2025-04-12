import React, { useState } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import {
    AppBar,
    Box,
    Button,
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

import BasicButton from "../components/Button/BasicButton.jsx";
// import { useTheme } from "@mui/system";

const ProcurementForm = () => {
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
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        displayEmpty
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Status
                                        </MenuItem>
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="open">Open</MenuItem>
                                        <MenuItem value="closed">Closed</MenuItem>
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

                                    <PrimaryButton type="save-draft" startIcon={<SaveIcon />}>
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





