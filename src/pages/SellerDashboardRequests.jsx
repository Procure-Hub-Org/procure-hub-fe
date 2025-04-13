import React, { useEffect, useState} from 'react';
import "../styles/Buyer.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
import Layout from '../components/Layout/Layout';
import {isAuthenticated, isSeller} from '../utils/auth';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '@mui/system';
import CustomSelect from "../components/Input/DropdownSelect.jsx";
import CustomTextField from "../components/Input/TextField.jsx";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import "../styles/SellerDashboardRequests.css";

const SellerDashboardRequests = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem("token");
    const [buyerTypes, setBuyerTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBuyerType, setSelectedBuyerType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [location, setLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [budgetMin, setBudgetMin] = useState();
    const [budgetMax, setBudgetMax] = useState();

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

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/procurement-categories`
            );
            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchRequests = async () => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/procurement-requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                buyer_id: selectedBuyerType,
                category_id: selectedCategory,
                location: location,
                deadline: selectedDate,
                budget_min: budgetMin,
                budget_max: budgetMax,
            }
        })
            .then((response) => {
                console.log(response.data.data)
                setRequests(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
            });
    };

    useEffect(() => {
        if (!isSeller()) {
            if (!isAuthenticated()) {
                navigate("/login");
            } else {
                navigate("/");
            }
            return;
        }
        fetchBuyerTypes();
        fetchCategories();
        fetchRequests();
    }, [token]);

    const onChangeDate = (date) => {
        setSelectedDate(date)
    }

    const discardFilters = () => {
        setSelectedBuyerType('')
        setSelectedCategory('')
        setLocation('')
        setSelectedDate(null)
        setBudgetMin('')
        setBudgetMax('')
    }

    function onClickFollow(id) {
        console.log(`Follow request with ID: ${id}`);
    }

    return (
        <>
            <Layout>
                <div className="row-container">
                    <div className="left-column-fixed">
                        <h3>Filters</h3>
                        <CustomSelect
                            label="Buyer Type"
                            name="buyer_type"
                            value={selectedBuyerType}
                            onChange={(e) => setSelectedBuyerType(e.target.value)}
                            options={[
                                ...buyerTypes.map((type) => ({
                                    label: type.name,
                                    value: type.id,
                                })),
                            ]}
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
                        <CustomTextField
                            label="Location"
                            name="location"
                            backgroundColor="white"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                            <CustomTextField
                                label="Budget min"
                                name="budgetMin"
                                value={budgetMin}
                                onChange={(e) => setBudgetMin(e.target.value)}
                            />
                            <CustomTextField
                                label="Budget max"
                                name="budgetMax"
                                value={budgetMax}
                                onChange={(e) => setBudgetMax(e.target.value)}
                            />
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Deadline until"
                                value={selectedDate}
                                onChange={onChangeDate}
                            />
                        </LocalizationProvider>

                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                            <PrimaryButton onClick={fetchRequests} style={{marginTop: '10px'}}>
                                Apply filters
                            </PrimaryButton>
                            <PrimaryButton onClick={discardFilters} style={{marginTop: '10px'}}>
                                Discard filters
                            </PrimaryButton>
                        </div>


                    </div>
                    <div className="right-column-flexible">

                        {/* 1. Title */}
                        <h3>Seller Dashboard - Procurement Requests</h3>

                        {/* 3. Requests List or "No requests" message */}
                        {/* Optional: Wrap list area in a div */}
                        <div className="requests-list-section">
                            <div className="scrollable-list-container">
                                {requests.length > 0 ? (
                                    <div className="requests-container"> {/* This is your existing inner container */}
                                        {requests.map((request) => (
                                            <div key={request.id} className="request-card">
                                                {/* Card Header */}
                                                <div
                                                    className="card-header d-flex justify-content-between align-items-center">
                                                    <h3 className="card-title">{request.title}</h3>
                                                    <PrimaryButton onClick={() => onClickFollow(request.id)}>
                                                        Follow
                                                    </PrimaryButton>
                                                </div>

                                                {/* Card Body */}
                                                <div className="card-body">
                                                    <p className="card-description">{request.description}</p>
                                                    <div
                                                        className="card-details-grid"> {/* Grid or Flex container for details */}
                                                        <div className="detail-item">
                                                            <strong>Category:</strong>
                                                            <span>{request.category_name}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <strong>Location:</strong>
                                                            <span>{request.location}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <strong>Budget:</strong>
                                                            <span>{request.budget_min} - {request.budget_max}</span> {/* Consider adding currency */}
                                                        </div>
                                                        <div className="detail-item">
                                                            <strong>Deadline:</strong>
                                                            <span>{dayjs(request.deadline).format('MMM D, YYYY h:mm A')}</span>
                                                        </div>
                                                        {request.buyer_type_name && ( // Conditionally show buyer type
                                                            <div className="detail-item">
                                                                <strong>Buyer Type:</strong>
                                                                <span>{request.buyer_type_name}</span>
                                                            </div>
                                                        )}
                                                        <div
                                                            className="detail-item full-width"> {/* Allow documentation to take full width */}
                                                            <strong>Documentation:</strong>
                                                            <span>{request.documentation}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Footer */}
                                                <div
                                                    className="card-footer d-flex justify-content-between align-items-center">
                                                            <span className="buyer-info">
                                                                Posted by: <strong>{request.buyer_full_name}</strong>
                                                            </span>
                                                    <span className="date-info">
                                                                Created: {dayjs(request.created_at).format('MMM D, YYYY')}
                                                            </span>
                                                    <span className={`card-status status-${request.status}`}>
                                                                {request.status}
                                                            </span>
                                                </div>
                                            </div> // End request-card
                                        ))}
                                    </div> // End requests-container
                                ) : (
                                    <p className="no-requests-message">No requests available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default SellerDashboardRequests;
