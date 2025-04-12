import React, { useEffect, useState } from 'react';
import "../styles/Buyer.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
import Layout from '../components/Layout/Layout';
import { isAuthenticated, isBuyer } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/system';

const BuyerDashboardRequests = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem("token");

    //Učitavanje korisnika sa backend-a
};