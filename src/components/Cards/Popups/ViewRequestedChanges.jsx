import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import SecondaryButton from "../../Button/SecondaryButton.jsx";
import axios from "axios";

const ViewRequestedChanges = ({ open, onClose, contractId }) => {
    const [requestedChangesData, setRequestedChangesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (open && contractId) {
            const fetchRequestedChanges = async () => {
                setLoading(true);
                setError(null);

                try {
                    // MOCK: Replace this with real API call once BE is ready
                    // const response = await axios.get(
                    //     `${import.meta.env.VITE_API_URL}/api/requested-changes/${contractId}`,
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${token}`,
                    //         },
                    //     }
                    // );
                    // setRequestedChangesData(response.data);

                    // Mock data:
                    const mockData = [
                        { id: 1, text: "Please adjust the delivery schedule.", created_at: "2024-11-01T10:00:00Z" },
                        { id: 2, text: "We need to revise the pricing terms.", created_at: "2024-11-03T15:20:00Z" },
                    ];
                    setRequestedChangesData(mockData);

                } catch (err) {
                    console.error("Error fetching requested changes:", err);
                    setError(err.message || "Unexpected error");
                } finally {
                    setLoading(false);
                }
            };

            fetchRequestedChanges();
        }
    }, [open, contractId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" fontWeight="bold">
                Requested Changes
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {requestedChangesData.length > 0 ? (
                        requestedChangesData.map((change) => (
                            <Card key={change.id} variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(change.created_at).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1" mt={1}>
                                        {change.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            {loading ? "Loading..." : "No requested changes found."}
                        </Typography>
                    )}
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <SecondaryButton
                    onClick={onClose}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: "none" }}
                >
                    Close
                </SecondaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default ViewRequestedChanges;