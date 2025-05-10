import React, { useState, useEffect, use} from "react";
import { useLocation } from 'react-router-dom';
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
import { DateTimeField } from "@mui/x-date-pickers";
import { Check } from "lucide-react";
import { set } from "date-fns";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { useTheme } from "@mui/system";

const EditProcurementForm = () => {
    const { id } = useParams(); // Preuzimanje `id` iz parametara rute
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [criterias, setCriteriaTypes] = useState([]);
    const [loadingCriterias, setLoadingCriterias] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCriteria, setSelectedCriteria] = useState("");
    const [enableBidEditing, setEnableBidEditing] = useState(false);
    const [bidEditDeadline, setBidEditDeadline] = useState("");
    const token = localStorage.getItem("token");
    const location = useLocation();
    const {procurementData} = location.state;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [formData, setFormData] = useState({
        title: procurementData.title,
        description: procurementData.description,
        location: procurementData.location,
        budget_min: Number(procurementData.budget_min),
        budget_max: Number(procurementData.budget_max),
        deadline: procurementData.deadline,
        category: procurementData.category_id,
        status: procurementData.status,
        items: procurementData.items,
        requirements: procurementData.requirements,
        evaluationCriteria: procurementData.evaluationCriteria,
        bid_edit_deadline: procurementData.bid_edit_deadline,
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
        if (procurementData && !loadingCategories && !loadingCriterias) {
            console.log("Recieved data:", procurementData);

            setFormData({
                ...formData,
                title: procurementData.title,
                description: procurementData.description,
                location: procurementData.location,
                budget_min: Number(procurementData.budget_min),
                budget_max: Number(procurementData.budget_max),
                deadline: formatDate(procurementData.deadline),
                category: procurementData.category_id,
                status: procurementData.status,
                items: procurementData.items,
                requirements: procurementData.requirements,

            });

            setSelectedCategory(procurementData.category_id);

            //evaluationCriteria mapping
            const mappedCriteria = procurementData.evaluationCriteria.map(criteria => ({
                //name: criteria.criteria_type_id,
                criteria_type_id: criteria.criteria_type_id,
                weight: criteria.weight,
                is_must_have: criteria.is_must_have,
            }));

            // setting evaluationCriteria in formData
            setFormData(prevState => ({
                ...prevState,
                evaluationCriteria: mappedCriteria,
            }));
            //setSelectedCriteria(mappedCriteria);
            console.log("Mapped evaluation criteria:", mappedCriteria);
            //console.log("Crieria added to the formData:", formData.evaluationCriteria);

            // setting bid_edit_deadline in formData
            setEnableBidEditing(procurementData.bid_edit_deadline !== null);
            setBidEditDeadline(procurementData.bid_edit_deadline ? formatDate(procurementData.bid_edit_deadline) : "");
           
            setFormData(prevState => ({
                ...prevState,
                bidEditDeadline: procurementData.bid_edit_deadline,
            }));

            //setSelectedCriteria(procurementData.evaluationCriteria.map(criteria => criteria.criteria_type_id));
        }
        fetchCategories(); // Fetch categories on component mount
        fetchCriteriaTypes(); // Fetch criterias on component mount
    }, [token, procurementData, loadingCategories, loadingCriterias]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/procurement-categories`
            );
            setCategories(response.data.data);
            setLoadingCategories(false);
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
            setLoadingCriterias(false);
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
        const updated = [...formData.evaluationCriteria];
        updated[index][field] = value;
        //setFormData((prev) => ({ ...prev, evaluationCriteria: updated }));
        setFormData({ ...formData, evaluationCriteria: updated });
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
            if (uniqueIds.has(crit.criteria_type_id)) {
                return { valid: false, message: `Criteria '${getCriteriaName(crit.criteria_type_id)}' is added more than once.` };
            }
            uniqueIds.add(crit.criteria_type_id);
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
    


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateFormData(formData, enableBidEditing, bidEditDeadline);
        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        const requestData = {
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            budget_min: Number(formData.budget_min),
            budget_max: Number(formData.budget_max),
            category: getCategoryName(selectedCategory),
            status: "active",
            location: formData.location,
            items: formData.items,
            requirements: formData.requirements,
            criteria: formData.evaluationCriteria.map(crit => ({
                //...crit,
                name: getCriteriaName(crit.criteria_type_id),
                weight: crit.weight,
                is_must_have: crit.is_must_have,
            })),
            bid_edit_deadline: enableBidEditing ? new Date(bidEditDeadline) : null,
        };
          
        console.log("Submit category:", requestData.category);
    
        console.log("Sending request data from submit:", requestData);
          
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/procurement/${id}/update`, requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );
        
            if((response.status != 200 && response.status != 201)) {
                toast.error("Request adding failed: " + response.data.message);
            }
            else {
                toast.success("Request adding Successful!");
                console.log("Server Response:", response.data);
                handleClosePreview(id);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                toast.error("Request adding failed: " + error.response.data.message);
            } else {
                toast.error("Request adding failed: " + error.message);
            }
        };
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();
        console.log("Submitted form as a draft:", formData);
        //console.log("Selected category:", selectedCategory);
        //console.log("Selected criteria:", selectedCriteria);

        const validation = validateFormData(formData, enableBidEditing, bidEditDeadline);
        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        const requestData = {
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            budget_min: Number(formData.budget_min),
            budget_max: Number(formData.budget_max),
            category: getCategoryName(selectedCategory),
            status: "draft",
            location: formData.location,
            items: formData.items,
            requirements: formData.requirements,
            criteria: formData.evaluationCriteria.map(crit => ({
                //...crit,
                name: getCriteriaName(crit.criteria_type_id),
                weight: crit.weight,
                is_must_have: crit.is_must_have,
            })),
            bid_edit_deadline: enableBidEditing ? new Date(bidEditDeadline) : null,
        };
          
        console.log("Draft category:", requestData.category);
        console.log("Sending request data for draft:", requestData);
        console.log("formData to send:", formData);
          
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/procurement/${id}/update`, requestData,
                {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if((response.status !== 200 && response.status !== 201)) {
                toast.error("Request update failed: " + response.data.message + " " + response.status);
            }
            else {
                toast.success("Request update Successful!");
                console.log("Server Response:", response.data);
                handleClosePreview(id);
            }
        } catch (error) {
            console.error("Error during creation of request:", error);
            if (error.response) {
                toast.error("Request update failed: " + error.response.data.message);
            } else {
                toast.error("Request update failed: " + error.message);
            }
        };
    }

    const handleClosePreview = (id) => {
        navigate(`/buyer-request/${id}`); // Redirect to the requests page
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={5000}/>
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
                                    Edit Procurement Request
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
                                        name="budget_min"
                                        type="number"
                                        value={formData.budget_min}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Budget Max"
                                        name="budget_max"
                                        type="number"
                                        value={formData.budget_max}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    {!loadingCategories && (
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
                                    )}

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
                                    {!loadingCriterias && formData.evaluationCriteria.map((crit, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <CustomSelect
                                                label="Criteria Type"
                                                name={`criteria-${index}`}
                                                //value={crit.name}
                                                value={crit.criteria_type_id}
                                                onChange={(e) => handleCriteriaChange(index, /*"name"*/"criteria_type_id", e.target.value)}
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
                                    <SecondaryButton type="button" onClick={() => handleClosePreview(id)} startIcon={<CloseIcon />}>
                                        Cancel
                                    </SecondaryButton>

                                    <PrimaryButton type="button" onClick={(e) => handleSaveDraft(e)} startIcon={<SaveIcon />}>
                                        Save Draft
                                    </PrimaryButton>

                                    <PrimaryButton type="submit" onClick={(e) => handleSubmit(e)} fullWidth startIcon={<SendIcon />}>
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

export default EditProcurementForm;