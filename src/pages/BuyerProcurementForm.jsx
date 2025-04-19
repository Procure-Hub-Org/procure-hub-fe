import React, { useState, useEffect } from "react";

import PrimaryButton from "../components/Button/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../components/Input/TextField";
import CustomSelect from "../components/Input/DropdownSelect";
import Checkbox from "@mui/material/Checkbox";
import { isAuthenticated, isBuyer } from '../utils/auth';
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
    FormControlLabel,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import OutlinedButton from "../components/Button/OutlinedButton.jsx";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
// ikonice
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

// import { useTheme } from "@mui/system";

const ProcurementForm = () => {
    const { id } = useParams(); // Preuzimanje `id` iz parametara rute
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [criterias, setCriteriaTypes] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState("");
    const [enableBidEditing, setEnableBidEditing] = useState(false);
    const [bidEditDeadline, setBidEditDeadline] = useState("");
    const token = localStorage.getItem("token");

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
        criteria: [{ type: "", weight: "", must_have: false }],
        bid_edit_deadline: "",
    });

    const navigate = useNavigate();

    // Load if id exists
    useEffect(() => {
        if (!isBuyer()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/";
            }
            return;
        }
        fetchCategories(); // Fetch categories on component mount
        fetchCriteriaTypes(); // Fetch criterias on component mount
    }, [token]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/procurement-categories`
            );
            setCategories(response.data.data);
            console.log("Fetched categories:", response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchCriteriaTypes = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/procurement-criterias`
            );
            setCriteriaTypes(response.data.data);
            console.log("Fetched criterias:", response.data.data);
        } catch (error) {
            console.error("Failed to fetch criteria:", error);
        }
    };

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

    const handleCriteriaChange = (index, field, value) => {
        const updated = [...formData.criteria];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, criteria: updated }));
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

    const addCriteria = () => {
        setFormData((prev) => ({
            ...prev,
            criteria: [...prev.criteria, { type: "", weight: 0 }],
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

    const removeCriteria = (index) => {
        const updated = [...formData.criteria];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, criteria: updated }));
    };

    const getCategoryName = (id) => {
        const category = categories.find((cat) => cat.id === id);   
        return category ? category.name : "Unknown Category";
    };

    const validateFormData = (formData, enableBidEditing, bidEditDeadline) => {
        // Criteria validation
        const totalWeight = formData.criteria.reduce((sum, crit) => sum + Number(crit.weight), 0);
        if (totalWeight !== 100) {
            return { valid: false, message: "Sum of criteria weights must be 100%." };
        }
    
        const uniqueIds = new Set();
        for (const crit of formData.criteria) {
            if (uniqueIds.has(crit.id)) {
                return { valid: false, message: `Criteria '${crit.name}' is added more than once.` };
            }
            uniqueIds.add(crit.id);
        }
    
        // Bid editing deadline validation
        if (enableBidEditing) {
            if (!bidEditDeadline) {
                return { valid: false, message: "Set the deadline for bid proposals editing." };
            }
    
            const bidDate = new Date(bidEditDeadline);
            const mainDeadline = new Date(formData.deadline);
    
            if (bidDate >= mainDeadline) {
                return { valid: false, message: "The bid proposal editing deadline must be before the deadline of procurement request." };
            }
        }
    
        return { valid: true };
    };

    const handleCloseForm = () => {
        navigate(`/buyer-procurement-requests`); // Redirect to the requests page
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateFormData(formData, enableBidEditing, bidEditDeadline);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        console.log("Submitted form:", formData);
        console.log("Selected category:", selectedCategory);

        const requestData = {
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            budget_min: formData.budgetMin,
            budget_max: formData.budgetMax,
            category: getCategoryName(selectedCategory),
            status: "active",
            location: formData.location,
            items: formData.items,
            requirements: formData.requirements,
            criteria: formData.criteria,
            bid_edit_deadline: formData.bid_edit_deadline ? bidEditDeadline : null,
        };
          
    
        console.log("Sending request data:", requestData);
          
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/procurement/create`, requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        
            if (response.status === 201) {
                alert("Request adding Successful!");
                console.log("Server Response:", response.data);
                navigate("/buyer-procurement-requests"); // Redirect to the requests page
            } else {
                alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                alert("Request adding failed: " + error.response.data.message);
            } else {
                alert("Request adding failed: " + error.message);
            }
        };
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();

        const validation = validateFormData(formData, enableBidEditing, bidEditDeadline);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        console.log("Submitted form:", formData);
        console.log("Selected category:", selectedCategory);

        const requestData = {
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            budget_min: Number(formData.budgetMin),
            budget_max: Number(formData.budgetMax),
            category: getCategoryName(selectedCategory),
            status: "draft",
            location: formData.location,
            items: formData.items,
            requirements: formData.requirements,
            criteria: formData.criteria,
            bid_edit_deadline: formData.bid_edit_deadline ? bidEditDeadline : null,
        };
          
    
        console.log("Sending request data:", requestData);
          
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/procurement/create`, requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        
            if (response.status === 201) {
                alert("Request adding Successful!");
                console.log("Server Response:", response.data);
                navigate("/buyer-procurement-requests"); // Redirect to the requests page
            } else {
                alert("Request adding failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                alert("Request adding failed: " + error.response.data.message);
            } else {
                alert("Request adding failed: " + error.message);
            }
        };
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
                                    <CustomSelect
                                        label="Category"
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        options={[
                                            ...categories.map((c) => ({
                                                label: c.name,
                                                value: c.id,
                                            })),
                                        ]}
                                    />

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
                                            <CustomSelect
                                                label="Requirement Type"
                                                name ="requirementType"	
                                                value={req.type}
                                                onChange={(e) =>
                                                    handleRequirementChange(index, "type", e.target.value)
                                                }
                                                options={[
                                                    { label: "Legal", value: "Legal" },
                                                    { label: "Technical", value: "Technical" },
                                                ]}
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

                                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                                        Criteria
                                    </Typography>
                                    {formData.criteria.map((crit, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <CustomSelect
                                                label="Criteria Type"
                                                name="criteria"
                                                value={selectedCriteria}
                                                onChange={(e) => setSelectedCriteria(e.target.value)}
                                                options={[
                                                    ...criterias.map((c) => ({
                                                        label: c.name,
                                                        value: c.id,
                                                    })),
                                                ]}
                                            />
                                            
                                            <TextField
                                                label="Criteria Weight (%)"	
                                                value={crit.weight}
                                                onChange={(e) =>
                                                    handleCriteriaChange(index, "weight", e.target.value)
                                                }
                                                fullWidth
                                                required
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                    checked={!!crit.isChecked}
                                                    onChange={(e) =>
                                                        handleCriteriaChange(index, "isChecked", e.target.checked)
                                                    }
                                                    color="primary"
                                                    inputProps={{ "aria-label": "primary checkbox" }}
                                                    />
                                                }
                                                label="Is must-have"
                                            />


                                            {formData.criteria.length > 1 && (
                                                <SecondaryButton
                                                    onClick={() => removeCriteria(index)}
                                                    fullWidth
                                                >
                                                    Remove Criteria
                                                </SecondaryButton>
                                            )}
                                        </Box>
                                    ))}
                                    <OutlinedButton
                                        onClick={addCriteria}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        + Add Criteria
                                    </OutlinedButton>

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={enableBidEditing}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setEnableBidEditing(checked);
                                                    if (!checked) {
                                                        setBidEditDeadline("");
                                                    }
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Enable Bid Editing"
                                    />

                                    {enableBidEditing && (
                                        <TextField
                                            label="Bid Editing Deadline"
                                            type="date" 
                                            value={bidEditDeadline}
                                            onChange={(e) => setBidEditDeadline(e.target.value)}
                                            fullWidth
                                            required
                                            sx={{ mt: 2 }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                    
                                    <SecondaryButton type="button" onClick={() => handleCloseForm()} startIcon={<CloseIcon />}>
                                        Cancel
                                    </SecondaryButton>

                                    <PrimaryButton type="save-draft" onClick={handleSaveDraft} startIcon={<SaveIcon />}>
                                        Save Draft
                                    </PrimaryButton>

                                    <PrimaryButton type="submit" onClick={handleSubmit} fullWidth startIcon={<SendIcon />}>
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