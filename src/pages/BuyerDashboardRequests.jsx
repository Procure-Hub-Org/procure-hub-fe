import React, { use, useEffect, useState } from 'react';
import {PlusCircle, Eye} from 'lucide-react';
import "../styles/Buyer.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
import BasicButton from '../components/Button/BasicButton';
import Layout from '../components/Layout/Layout';
import { isAuthenticated, isBuyer } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/system';
import { idID } from '@mui/material/locale';

const BuyerDashboardRequests = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [activeStatus, setActiveStatus] = useState('active');
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!isBuyer()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/";
            }
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/procurement/requests`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setRequests(response.data.requests);
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
            });
    }, [token]);

    const filterRequests = requests.filter(
        (request) => request.status === activeStatus
    );

    const handleViewRequest = (id) => {
        console.log(`View request with ID: ${id}`);
        navigate(`/buyer-request/${id}`); // Redirect to the request details page
    }

    const handleCreateRequest = () => {
        console.log("Create new request");
        navigate("/new-request"); // Redirect to the create request page
    }

    const statusButton = [
        { status: 'active', label: 'Active'},
        { status: 'draft', label: 'Draft' },
        { status: 'closed', label: 'Closed'},
        { status: 'awarded', label: 'Awarded'},
    ];

    //Loading requests from backend
    return(
        <Layout>
        <div className="dashboard-container">
            <h3>Procurement Requests</h3>

            <div style={{display: 'flex', alignSelf: 'flex-start', gap: '24px', marginBottom:'24px'}}>
                {statusButton.map(({ status, label }) => (
                    <PrimaryButton
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={activeStatus === status ? 'bg-blue-700' : ''}
                    >
                        {label}
                    </PrimaryButton>
                ))}
            </div>

            <div className="button-container">
                <PrimaryButton onClick={handleCreateRequest}>
                    <PlusCircle size={22} />
                    <span>  New Request</span>
                </PrimaryButton>
            </div>
        
            <div className="panel">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="th">Title</th>
                            <th className="th">Description</th>
                            <th className="th">Category</th>
                            <th className="th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterRequests.map((request) => (
                            <tr key={request.id} className="tr">
                            <td className="td">{request.title}</td>
                            <td className="td">{request.desription}</td>
                            <td className="td">{request.category}</td>
                            <td className="td">
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    <PrimaryButton onClick={() => handleViewRequest(request.id)}>
                                        View
                                    </PrimaryButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filterRequests.length === 0 && (
                        <tr>
                            <td colSpan="4" className="td">
                                No requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerDashboardRequests;