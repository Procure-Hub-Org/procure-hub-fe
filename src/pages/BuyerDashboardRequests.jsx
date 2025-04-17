import React, { use, useEffect, useState } from 'react';
import {PlusCircle, Eye} from 'lucide-react';
import "../styles/Buyer.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
import BasicButton from '../components/Button/BasicButton';
import SecondaryButton from '../components/Button/SecondaryButton';
import Layout from '../components/Layout/Layout';
import { isAuthenticated, isBuyer } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/system';
import { idID } from '@mui/material/locale';
import { set } from 'date-fns';

const BuyerDashboardRequests = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [activeStatus, setActiveStatus] = useState('');
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

        axios.get(`${import.meta.env.VITE_API_URL}/api/procurement-requests/buyer`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setRequests(response.data.requests);
                setActiveStatus('');
                setFilteredRequests(response.data.requests)
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
            });
    }, [token]);

    const toggleActiveStatus = (status) => {
        setActiveStatus(status);
        let filterRequests = [];
        if (status === '') {
            filterRequests = requests;
        }
        else{
            filterRequests = requests.filter((request) => request.status === status);
        }
        setFilteredRequests(filterRequests);
    }

    const handleViewRequest = (id) => {
        console.log(`View request with ID: ${id}`);
        navigate(`/buyer-request/${id}`); // Redirect to the request details page
    }

    const handleCreateRequest = () => {
        console.log("Create new request");
        navigate("/new-request"); // Redirect to the create request page
    }

    const statusButton = [
        { status: '', label: 'All' },
        { status: 'active', label: 'Active'},
        { status: 'draft', label: 'Draft' },
        { status: 'closed', label: 'Closed'},
        { status: 'awarded', label: 'Awarded'},
        { status: 'frozen', label: 'Frozen', isSecondary: true },
    ];

    //Loading requests from backend
    return(
        <Layout>
        <div className="dashboard-container">
            <h3>Procurement Requests</h3>

            <div className="parent-button-container">
                <div className="status-buttons-container">
                    {statusButton.map(({ status, label, isSecondary }) => (
                        isSecondary ? (
                            <SecondaryButton
                                key={status}
                                onClick={() => toggleActiveStatus(status)}
                                disabled={activeStatus === status}
                                className={activeStatus === status ? 'bg-blue-700 cursor-not-allowed opacity-60' : ''}
                            >
                                {label}
                            </SecondaryButton> 
                        ):(
                            <PrimaryButton
                                key={status}
                                onClick={() => toggleActiveStatus(status)}
                                disabled={activeStatus === status}
                                className={activeStatus === status ? 'bg-blue-700 cursor-not-allowed opacity-60' : ''}
                            >
                                {label}
                            </PrimaryButton>
                        )
                    ))}
                </div>

                <div className="button-container">
                    <PrimaryButton onClick={handleCreateRequest}>
                    <PlusCircle size={25} style={{ paddingRight: '8px' }}/>
                    <span>New Request</span>
                    </PrimaryButton>
                </div>
            </div>

            <div className="panel">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="th">Title</th>
                            <th className="th">Description</th>
                            <th className="th">Category</th>
                            <th className="th">Status</th>
                            <th className="th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="tr">
                            <td className="td">{request.title}</td>
                            <td className="td">{request.description}</td>
                            <td className="td">{request.procurementCategory}</td>
                            <td className="td">{request.status}</td>
                            <td className="td">
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    <PrimaryButton onClick={() => handleViewRequest(request.id)}>
                                        <Eye size={25} style={{ paddingRight: '8px' }}/>
                                        <span>View</span>
                                    </PrimaryButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                        <tr>
                            <td colSpan="5" className="td">
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