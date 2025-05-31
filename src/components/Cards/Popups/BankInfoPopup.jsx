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
import OutlinedButton from "../../Button/OutlinedButton.jsx";

const BankInfoPopup = ({ open, onClose, bankInfo }) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) {
            setText("");
            onClose();
        }
    };

    const handleSubmit = async (includeBank) => {
        setLoading(true);

        try {
            const payload = includeBank && text.trim()
                ? { seller_bank_account: text.trim() }
                : {};

            // Prepare for BE route: /contracts/:id/accept
            await axios.post(
                `${import.meta.env.VITE_API_URL}/contracts/${bankInfo?.contractId}/accept`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            handleClose(); // success callback
        } catch (err) {
            console.error("Failed to accept contract:", err);
            // optionally show an error toast/snackbar
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" gutterBottom>
                Add Bank Account Information
            </DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardContent sx={{ pt: 1, mb: 0 }}>
                        <Typography>
                            You're about to accept this contract.
                            Would you like to add your bank account information for payment processing?
                        </Typography>

                        <Typography variant="subtitle1" mt={2}>
                            <strong>Bank Account Number</strong>
                        </Typography>
                        <TextField
                            label="Please provide your bank account number"
                            fullWidth
                            multiline
                            minRows={2}
                            margin="normal"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
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
                <OutlinedButton
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: 'none' }}
                >
                    Skip And Accept Contract
                </OutlinedButton>
                <PrimaryButton
                    onClick={() => handleSubmit(true)}
                    disabled={loading || !text.trim()}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: 'none' }}
                >
                    Add Bank Account
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default BankInfoPopup;