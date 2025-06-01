import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import SecondaryButton from "../../Button/SecondaryButton.jsx";
import PrimaryButton from "../../Button/PrimaryButton.jsx";
import axios from 'axios';

const BankInfoPopup = ({ open, onClose, contractId }) => {
    const [bankAccount, setBankAccount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        if (!loading) {
            setBankAccount("");
            setError("");
            onClose();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/accept`;

            const data = bankAccount.trim()
                ? { seller_bank_account: bankAccount.trim() }
                : {}; // send empty object if no bank account provided

            await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            handleClose();
        } catch (err) {
            console.error("Failed to accept contract:", err);
            setError("Failed to accept contract. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" gutterBottom>
                Accept Contract
            </DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardContent sx={{ pt: 1, mb: 0 }}>
                        <Typography>
                            You're about to accept this contract.
                            You can provide your bank account information below for payment processing, or leave it empty.
                        </Typography>

                        <Typography variant="subtitle1" mt={2}>
                            <strong>Bank Account Number (optional)</strong>
                        </Typography>
                        <TextField
                            label="Bank Account Number"
                            fullWidth
                            multiline
                            minRows={2}
                            margin="normal"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                            disabled={loading}
                        />
                        {error && (
                            <Typography color="error" variant="body2" mt={1}>
                                {error}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <SecondaryButton
                    onClick={handleClose}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: 'none' }}
                >
                    Cancel
                </SecondaryButton>
                <PrimaryButton
                    onClick={handleSubmit}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: 'none' }}
                >
                    Accept
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default BankInfoPopup;