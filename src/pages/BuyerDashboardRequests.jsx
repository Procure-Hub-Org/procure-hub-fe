import React, { use, useEffect, useState } from 'react';
import {PlusCircle, Eye} from 'lucide-react';
import "../styles/Buyer.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
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

        axios.get(`${import.meta.env.VITE_API_URL}/api/buyer/requests`, {
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

    /*const handleCreateRequest = () => {
        console.log("Create new request");
        navigate("/new-request"); // Redirect to the create request page
    }*/

    //Loading requests from backend
    return(
        <Layout>
      <div className="dashboard-container">
        <div className="button-container">
          <PrimaryButton onClick={() => navigate("/new-request")}>
            Create New Request
          </PrimaryButton>
        </div>
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Title</th>
                <th className="th">Description</th>
                <th className="th">Category</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="tr">
                  <td className="td">{user.id}</td>
                  <td className="td">{user.first_name}</td>
                  <td className="td">{user.last_name}</td>
                  <td className="td">{user.email}</td>
                  <td className="td">{user.role}</td>
                  <td className="td">{user.status}</td>
                  <td className="td">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <PrimaryButton onClick={() => handleUpdate(user.id)}>
                        Update
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleDelete(user.id)}>
                        Delete
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleSuspend(user.id)}>
                        Suspend
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleApprove(user.id)}>
                        Approve
                      </PrimaryButton>
                  </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
export default BuyerDashboardRequests;