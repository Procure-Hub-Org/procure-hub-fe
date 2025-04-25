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
import NotificationToast from "../components/Notifications/NotificationToast";

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
    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [toast, setToast] = useState({ show: false, message: '' });



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
        evaluationCriteria: [{ name: "", weight: "", is_must_have: false }],
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
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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
        const updated = [...formData.evaluationCriteria];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, evaluationCriteria: updated }));
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
            evaluationCriteria: [...prev.evaluationCriteria, { name: "", weight: 0 }],
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
        const updated = [...formData.evaluationCriteria];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, evaluationCriteria: updated }));
    };

    const getCategoryName = (id) => {
        const category = categories.find((cat) => cat.id === id);
        return category ? category.name : "Unknown Category";
    };

    const getCriteriaName = (id) => {
        const criteria = criterias.find((cri) => cri.id === id);
        return criteria.name || "Unknown Category";
    };

    const validateFormData = (formData, enableBidEditing, bidEditDeadline) => {
        // Criteria validation
        const totalWeight = formData.evaluationCriteria.reduce((sum, crit) => sum + Number(crit.weight), 0);
        if (totalWeight !== 100) {
            return { valid: false, message: "Sum of criteria weights must be 100%." };
        }

        const uniqueIds = new Set();
        for (const crit of formData.evaluationCriteria) {
            if (uniqueIds.has(crit.name)) {
                return { valid: false, message: `Criteria '${crit.name}' is added more than once.` };
            }
            uniqueIds.add(crit.name);
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
            //evaluationCriteria: formData.evaluationCriteria,
            criteria: formData.evaluationCriteria.map(crit => ({
                ...crit,
                name: getCriteriaName(crit.name),
            })),
            bid_edit_deadline: new Date(bidEditDeadline) || null,
        };


        console.log("Sending request data from submit:", requestData);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/procurement/create`, requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (true) {
                setToast({ show: true, message: 'Request adding Successful!' });
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

        console.log("Submitted form as a draft:", formData);
        //console.log("Selected category:", selectedCategory);

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
            //evaluationCriteria: formData.evaluationCriteria,
            criteria: formData.evaluationCriteria.map(crit => ({
                ...crit,
                name: getCriteriaName(crit.name),
            })),
            bid_edit_deadline: new Date(bidEditDeadline) || null,
        };


        console.log("Sending request data for draft:", requestData);

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
                setToast({ show: true, message: 'Request saving Successful!' });
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


    const validateField = (name, value) => {
        const rules = validationRules[name];
        if (!rules) return "";
        for (let rule of rules) {
            if (!rule.test(value)) return rule.message;
        }
        return "";
    };

    const validationRules = {
        title: [
            { test: (value) => !!value?.trim(), message: "Title is required" },
            { test: (value) => value.length <= 100, message: "Title must be under 100 characters" },
        ],
        description: [
            { test: (value) => !!value?.trim(), message: "Description is required" },
        ],
        location: [
            { test: (value) => !!value?.trim(), message: "Location is required" },
        ],
        deadline: [
            { test: (value) => !!value, message: "Deadline is required" },
        ],
        budgetMin: [
            { test: (value) => !!value, message: "Minimum budget is required" },
            { test: (value) => !isNaN(value) && Number(value) >= 0, message: "Minimum budget must be a valid number" },
        ],
        budgetMax: [
            { test: (value) => !!value, message: "Maximum budget is required" },
            { test: (value) => !isNaN(value) && Number(value) >= 0, message: "Maximum budget must be a valid number" },
        ],
        quantity: [
            { test: (value) => Number(value) > 0, message: "Quantity must be a valid number" },
        ],
        weight: [
            { test: (value) => Number(value) > 0, message: "Criteria weight must be a valid number" },
            { test: (value) => Number(value) <= 100, message: "Criteria weight must be a valid number" },
        ],
        category: [
            { test: (value) => !!value, message: "Category is required" },
        ],
        requirementType: [
            { test: (value) => !!value, message: "Requirement type is required" },
        ],
        criteriaType: [
            { test: (value) => !!value, message: "Criteria type is required" },
        ],
        itemdescription: [
            { test: (value) => !!value?.trim(), message: "Description is required" },
        ],
    };

    // Handles blur for simple fields
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    };

    // Handles blur for nested item fields like items or criteria
    const handleItemBlur = (index, field, value, listKey = "items") => {
        const error = validateField(field, value);

        setTouchedFields(prev => ({
            ...prev,
            [listKey]: {
                ...(prev[listKey] || []),
                [index]: {
                    ...((prev[listKey] && prev[listKey][index]) || {}),
                    [field]: true,
                },
            },
        }));

        setFieldErrors(prev => ({
            ...prev,
            [listKey]: {
                ...(prev[listKey] || []),
                [index]: {
                    ...((prev[listKey] && prev[listKey][index]) || {}),
                    [field]: error,
                },
            },
        }));
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
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touchedFields.title && !!fieldErrors.title}
                                        helperText={touchedFields.title ? fieldErrors.title : ""}
                                    />

                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touchedFields.description && !!fieldErrors.description}
                                        helperText={touchedFields.description ? fieldErrors.description : ""}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touchedFields.location && !!fieldErrors.location}
                                        helperText={touchedFields.location ? fieldErrors.location : ""}
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Budget Minimum"
                                        name="budgetMin"
                                        value={formData.budgetMin}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touchedFields.budgetMin && !!fieldErrors.budgetMin}
                                        helperText={touchedFields.budgetMin ? fieldErrors.budgetMin : ""}
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Budget Maximum"
                                        name="budgetMax"
                                        value={formData.budgetMax}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touchedFields.budgetMax && !!fieldErrors.budgetMax}
                                        helperText={touchedFields.budgetMax ? fieldErrors.budgetMax : ""}
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
                                        onBlur={handleBlur}
                                        error={touchedFields.deadline && !!fieldErrors.deadline}
                                        helperText={touchedFields.deadline ? fieldErrors.deadline : ""}
                                    />



                                    <CustomSelect
                                        label="Category"
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        onBlur={handleBlur}
                                        error={touchedFields.category && !!fieldErrors.category}
                                        helperText={touchedFields.category ? fieldErrors.category : ""}
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
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "title", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.title &&
                                                    !!fieldErrors.items?.[index]?.title
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.title
                                                        ? fieldErrors.items?.[index]?.title
                                                        : ""
                                                }
                                            />
                                            <TextField
                                                label="Item Description"
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleItemChange(index, "description", e.target.value)
                                                }
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "itemdescription", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.itemdescription &&
                                                    !!fieldErrors.items?.[index]?.itemdescription
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.itemdescription
                                                        ? fieldErrors.items?.[index]?.itemdescription
                                                        : ""
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
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "quantity", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.quantity &&
                                                    !!fieldErrors.items?.[index]?.quantity
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.quantity
                                                        ? fieldErrors.items?.[index]?.quantity
                                                        : ""
                                                }
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
                                                name="requirementType"
                                                value={req.type}
                                                onChange={(e) =>
                                                    handleRequirementChange(index, "type", e.target.value)
                                                }
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "requirementType", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.requirementType &&
                                                    !!fieldErrors.items?.[index]?.requirementType
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.requirementType
                                                        ? fieldErrors.items?.[index]?.requirementType
                                                        : ""
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
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "description", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.description &&
                                                    !!fieldErrors.items?.[index]?.description
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.description
                                                        ? fieldErrors.items?.[index]?.description
                                                        : ""
                                                }
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
                                    {formData.evaluationCriteria.map((crit, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <CustomSelect
                                                label="Criteria Type"
                                                name={`criteria-${index}`}
                                                value={crit.name}
                                                onChange={(e) => handleCriteriaChange(index, "name", e.target.value)}
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "criteriaType", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.criteriaType &&
                                                    !!fieldErrors.items?.[index]?.criteriaType
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.criteriaType
                                                        ? fieldErrors.items?.[index]?.criteriaType
                                                        : ""
                                                }
                                                options={criterias.map((c) => ({
                                                    label: c.name,
                                                    value: c.id,
                                                }))}
                                            />

                                            <TextField
                                                label="Criteria Weight (%)"
                                                value={crit.weight}
                                                onChange={(e) =>
                                                    handleCriteriaChange(index, "weight", e.target.value)
                                                }
                                                fullWidth
                                                required
                                                onBlur={(e) =>
                                                    handleItemBlur(index, "weight", e.target.value)
                                                }
                                                error={
                                                    touchedFields.items?.[index]?.weight &&
                                                    !!fieldErrors.items?.[index]?.weight
                                                }
                                                helperText={
                                                    touchedFields.items?.[index]?.weight
                                                        ? fieldErrors.items?.[index]?.weight
                                                        : ""
                                                }
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!crit.is_must_have}
                                                        onChange={(e) =>
                                                            handleCriteriaChange(index, "is_must_have", e.target.checked)
                                                        }
                                                        color="primary"
                                                        inputProps={{ "aria-label": "primary checkbox" }}
                                                    />
                                                }
                                                label="Is must-have"
                                            />


                                            {formData.evaluationCriteria.length > 1 && (
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
                        {toast.show && (
                            <NotificationToast
                                message={toast.message}
                                autoHideDuration={3000}
                                onClose={() => setToast({ ...toast, show: false })}
                            />
                        )}
                    </Container>
                </Box>
            </AppBar>
        </Layout>
    );
};

export default ProcurementForm;