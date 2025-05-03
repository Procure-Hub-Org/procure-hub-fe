import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/Input/DropdownSelect";
import { isAuthenticated, isBuyer } from '../utils/auth';
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { AppBar, Box, Card, CardContent, Container, Typography, TextField } from "@mui/material";
import TimerIcon from "@mui/icons-material/AvTimer";

const BuyerCreateAuctionForm = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [selectedProcurement, setSelectedProcurement] = useState("");
    const [startingTime, setStartingTime] = useState("");
    const [durationHours, setDurationHours] = useState("1");
    const [durationMinutes, setDurationMinutes] = useState("0");
    const [minIncrement, setMinIncrement] = useState("");
    const [lastCallTimer, setLastCallTimer] = useState("");
    const [lowestBid, setLowestBid] = useState("1"); // :)?
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
            .catch((error) => console.error("Error fetching requests:", error));
    }, [token]);

    const totalDurationMinutes = parseInt(durationHours || "0") * 60 + parseInt(durationMinutes || "0");

    const handleSubmit = () => {
        const now = new Date();
        const startDateTime = new Date(startingTime);

        // Validations
        if (!selectedProcurement) {
            alert("Please select a procurement request.");
            return;
        }

        if (startDateTime <= now) {
            alert("Starting time must be in the future.");
            return;
        }

        // Ensure minIncrement is greater than or equal to the lowestBid if lowestBid exists
        if (lowestBid && parseFloat(minIncrement) < parseFloat(lowestBid)) {
            alert(`Minimum bid increment must be at least $${lowestBid}.`);
            return;
        }

        if (parseInt(lastCallTimer || "0") > totalDurationMinutes / 2) {
            alert("Last call timer cannot exceed half the auction duration.");
            return;
        }

        // Formatting duration as HH:MM
        const formattedDuration = `${String(durationHours).padStart(2, "0")}:${String(durationMinutes).padStart(2, "0")}`;

        const payload = {
            procurement_id: selectedProcurement,  // The ID of the selected procurement request
            starting_time: startingTime,         // The starting time from input
            duration: totalDurationMinutes,      // Total duration in minutes
            min_bid_increment: parseFloat(minIncrement),  // Minimum bid increment
            last_call_timer: parseInt(lastCallTimer || "0")  // Last call timer in minutes
        };

        console.log(payload);

        // Send the POST request - OVO NAM JOŠ OSTAJE DA POVEŽEMO
        axios.post(`${import.meta.env.VITE_API_URL}/auction/create`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log("Auction Created:", response.data);
                // Optionally redirect or show a success message
                navigate("/buyer-procurement-requests");
            })
            .catch(error => {
                console.error("Error creating auction:", error);
                // Handle error (e.g., show error message)
            });
    };

    return (
        <Layout>
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
                                <Typography>Starting time</Typography>
                                <TextField
                                    type="datetime-local"
                                    value={startingTime}
                                    onChange={(e) => setStartingTime(e.target.value)}
                                    fullWidth
                                    inputProps={{
                                        min: new Date().toISOString().slice(0, 16) // Set minimum value to current date/time
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
                                    onChange={(e) => setLastCallTimer(e.target.value)}
                                    fullWidth
                                    inputProps={{ min: 0, max: totalDurationMinutes / 2 }}
                                />

                                {/* Buttons */}
                                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <PrimaryButton onClick={() => navigate("/buyer-procurement-requests")}>
                                        Cancel
                                    </PrimaryButton>
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