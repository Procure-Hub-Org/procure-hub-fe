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
import axios from "axios";

const RequestChangesPopup = ({ open, onClose, contractId }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/contract/${contractId}/request-change`, {
                message: text,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            onClose(); // close on success
        } catch (error) {
            console.error("Change request error:", error);
            setError(error?.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setText('');
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle variant="h5" gutterBottom>
                Request Contract Changes
            </DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardContent sx={{ pt: 1, mb: 0 }}>
                        <Typography>
                            This will notify the buyer about your requested changes.
                        </Typography>
                        <TextField
                            label="Changes Description"
                            fullWidth
                            multiline
                            minRows={4}
                            margin="normal"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2">
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
                    sx={{ minWidth: 100, textTransform: 'none' }}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton
                    onClick={handleSubmit}
                    disabled={loading || !text.trim()}
                    size="medium"
                    sx={{ minWidth: 100, textTransform: 'none' }}>
                    Submit
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default RequestChangesPopup;