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
import "../styles/SellerDashboardRequests.css";
import { fetchFavorites } from "../utils/favorites";
import ProcurementRequestCard from '../components/Cards/ProcurementRequestCard.jsx';

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
    const [followedRequests, setFollowedRequests] = useState({});
    
    const [submittedBidRequestIds, setSubmittedBidRequestIds] = useState([]);

    const fetchSubmittedBidRequestIds = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bids/request-ids`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setSubmittedBidRequestIds(response.data.requestIds);
        } catch (error) {
            console.error('Error fetching submitted bid request IDs:', error);
        }
    };
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
                buyer_type_name: selectedBuyerType,
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
        fetchSubmittedBidRequestIds();
      
        const loadFavorites = async () => {
          const favorites = await fetchFavorites();
          const followedMap = {};
          favorites.forEach((req) => {
            followedMap[req.id] = true;
          });
          setFollowedRequests(followedMap);
        };
      
        loadFavorites();
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
                                    value: type.name,
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
                <h3>Seller Dashboard - Procurement Requests</h3>
                <div className="requests-list-section">
                    <div className="scrollable-list-container">
                        {requests.length > 0 ? (
                            <div className="requests-container">
                                {requests.map((request) => (
                                    <ProcurementRequestCard
                                        key={request.id}
                                        request={request}
                                        followedRequests={followedRequests}
                                        setFollowedRequests={setFollowedRequests}
                                        submittedBidRequestIds={submittedBidRequestIds}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No requests available</p>
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
