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

const ContractDisputeSubmit = ({ open, onClose, contractId }) => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        console.log("[DEBUG] useEffect triggered:", { open, contractId });
        if (open && contractId) {
            const fetchDisputes = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/disputes/${contractId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("[INFO] Raw dispute response data:", response.data);
                    setDisputes(response.data);
                } catch (error) {
                    console.error("Error fetching disputes:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchDisputes();
        }
    }, [open, contractId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" fontWeight="bold">
                Disputes for Contract
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {disputes.map((dispute) => (
                        <Card key={dispute.id} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1">
                                    Sender: <strong>
                                        {(dispute.buyer_name || dispute.seller_name) || "Unknown User"}{" "}
                                        (
                                            {dispute.buyer_company_name ||
                                                dispute.seller_company_name ||
                                                "Unknown Company"}
                                        )
                                </strong>
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    {dispute.complainment_text}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
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

export default ContractDisputeSubmit;
