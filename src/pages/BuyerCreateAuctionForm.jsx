import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/Input/DropdownSelect";
import { isAuthenticated, isBuyer } from '../utils/auth';
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { AppBar, Box, Card, CardContent, Container, Typography, TextField } from "@mui/material";
import TimerIcon from "@mui/icons-material/AvTimer";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import { trackEvent } from "../utils/plausible";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuyerCreateAuctionForm = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [selectedProcurement, setSelectedProcurement] = useState("");
    const [startingTime, setStartingTime] = useState("");
    const [durationHours, setDurationHours] = useState("1");
    const [durationMinutes, setDurationMinutes] = useState("0");
    const [minIncrement, setMinIncrement] = useState("");
    const [lastCallTimer, setLastCallTimer] = useState("");
    const [lastCallTimerError, setLastCallTimerError] = useState("");
    const [lowestBid, setLowestBid] = useState("1"); // :)?
    const [startingTimeError, setStartingTimeError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!isBuyer()) {
            window.location.href = isAuthenticated() ? "/" : "/login";
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/procurement/closed-without-auction`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => setRequests(response.data.requests))
            .catch((error) => {
                console.error("Error fetching requests:", error);
                toast.error(`Error fetching procurement requests: ${error.response?.data?.message || error.message || "Unknown error"}`);
            });
    }, [token]);

    const totalDurationMinutes = parseInt(durationHours || "0") * 60 + parseInt(durationMinutes || "0");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProcurement) {
            trackEvent('auction', {
                action: 'create',
                status: 'validation_failed',
                error: 'no_procurement_selected'
            });
            alert("Please select a procurement request");
            return;
        }

        if (!startingTime) {
            trackEvent('auction', {
                action: 'create',
                status: 'validation_failed',
                error: 'no_starting_time'
            });
            setStartingTimeError("Please select a starting time");
            return;
        }

        if (!minIncrement) {
            trackEvent('auction', {
                action: 'create',
                status: 'validation_failed',
                error: 'no_min_increment'
            });
            alert("Please enter a minimum increment amount");
            return;
        }

        const totalDurationMinutes = parseInt(durationHours || "0") * 60 + parseInt(durationMinutes || "0");
        if (totalDurationMinutes < 1) {
            trackEvent('auction', {
                action: 'create',
                status: 'validation_failed',
                error: 'invalid_duration'
            });
            alert("Duration must be at least 1 minute");
            return;
        }

        const auctionData = {
            procurement_id: Number(selectedProcurement),
            starting_time: startingTime,
            duration: totalDurationMinutes,
            min_bid_increment: parseFloat(minIncrement),
            last_call_timer: parseInt(lastCallTimer) || 0
        };

        try {
            console.log("Creating auction with data:", auctionData);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auctions`,
                auctionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                trackEvent('auction', {
                    action: 'create',
                    status: 'success',
                    procurement_request_id: selectedProcurement,
                    duration_minutes: totalDurationMinutes,
                    min_increment: parseFloat(minIncrement),
                    has_last_call: !!lastCallTimer
                });
                console.log("Auction Created:", response.data);
                toast.success("Auction created successfully!");
                navigate("/buyer-auctions");
            } else {
                trackEvent('auction', {
                    action: 'create',
                    status: 'failed',
                    procurement_request_id: selectedProcurement,
                    error: response.data.message
                });
                alert("Failed to create auction: " + response.data.message);
            }
        } catch (error) {
            trackEvent('auction', {
                action: 'create',
                status: 'error',
                procurement_request_id: selectedProcurement,
                error: error.response?.data?.message || error.message
            });
            console.error("Error creating auction:", error);
            alert("Failed to create auction: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={5000} />
            <AppBar position="static">
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                    <Container maxWidth="sm">
                        <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom align="center">Create Auction</Typography>

                                {/* Procurement Request */}
                                <Typography>Procurement request</Typography>
                                <CustomSelect
                                    label="Select a closed request"
                                    name="request"
                                    value={selectedProcurement}
                                    onChange={(e) => setSelectedProcurement(e.target.value)}
                                    options={[
                                        { label: "Select a procurement request...", value: "" },
                                        ...requests.map(req => ({
                                            label: req.title,   // What user sees
                                            value: req.id       // What we send
                                        }))
                                    ]}
                                />

                                {/* Starting Time */}
                                <Typography sx={{ mb: 1 }}>Start date and time</Typography>
                                <TextField
                                    type="datetime-local"
                                    placeholder="YYYY-MM-DD hh:mm"
                                    label="Enter auction start date & time"
                                    value={startingTime}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setStartingTime(value);

                                        const now = new Date();
                                        const selected = new Date(value);

                                        if (selected <= now) {
                                            setStartingTimeError("Starting time must be in the future!");
                                        } else {
                                            setStartingTimeError("");
                                        }
                                    }}
                                    fullWidth
                                    error={!!startingTimeError}
                                    helperText={startingTimeError}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                                {/* Duration */}
                                <Typography sx={{ mb: 1 }}>Duration</Typography>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <TextField
                                        label="Hours"
                                        type="number"
                                        value={durationHours}
                                        onChange={(e) => setDurationHours(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Minutes"
                                        type="number"
                                        value={durationMinutes}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (val >= 0 && val < 60) {
                                                setDurationMinutes(val.toString());
                                            }
                                        }}
                                        inputProps={{ min: 0, max: 59 }}
                                        fullWidth
                                    />
                                </Box>

                                {/* Minimum Bid Increment */}
                                <Typography sx={{ mt: 1 }}>Minimum Bid Increment ($)</Typography>
                                <TextField
                                    type="number"
                                    value={minIncrement}
                                    onChange={(e) => setMinIncrement(Math.max(e.target.value, lowestBid))}
                                    fullWidth
                                    inputProps={{ min: lowestBid }}
                                />

                                {/* Last Call Timer */}
                                <Typography>
                                    <TimerIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                    Last Call Timer (minutes)
                                </Typography>
                                <TextField
                                    type="number"
                                    value={lastCallTimer}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const maxAllowed = totalDurationMinutes / 2;

                                        if (val > maxAllowed) {
                                            setLastCallTimerError(`Last call timer can't exceed ${Math.floor(maxAllowed)} minutes.`);
                                        } else {
                                            setLastCallTimerError("");
                                            setLastCallTimer(e.target.value);
                                        }
                                    }}
                                    fullWidth
                                    error={!!lastCallTimerError}
                                    helperText={lastCallTimerError}
                                />

                                {/* Buttons */}
                                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <SecondaryButton onClick={() => navigate("/buyer-auctions")}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton onClick={handleSubmit}>
                                        Create Auction
                                    </PrimaryButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </AppBar>
        </Layout>
    );
};

export default BuyerCreateAuctionForm;