import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CardContent, Card,
} from '@mui/material';
import SecondaryButton from "../../Button/SecondaryButton.jsx";
import PrimaryButton from "../../Button/PrimaryButton.jsx";
import {data} from "react-router-dom";

const SuspiciousActivityReportPopup = ({ open, onClose, procurementTitle, procurementRequestId }) => {
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        if (!loading) {
            setReportText('');
            setError(null);
            setSuccess(false);
            onClose();
        }
    };

    const handleSubmit = async () => {
        if (!reportText.trim()) {
            setError('Please enter a report.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = {
                procurement_request_id: procurementRequestId,
                text: reportText.trim(),
            };

            console.log("Suspicious activity JSON payload:", data);

            setSuccess(true);
            handleClose();
        } catch (e) {
            setError('Something went wrong while preparing the report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5">
                Submit Suspicious Activity Report for: <strong>{procurementTitle || 'Untitled'}</strong>
            </DialogTitle>
            <DialogContent>
                <Card elevation={0}>
                    <CardContent sx={{ pt: 1, mb:0 }}>
                <TextField
                    label="Report Details"
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Describe the suspicious activity..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                />
                </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <SecondaryButton
                    onClick={handleClose}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100 , textTransform: 'none' }}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton
                    onClick={handleSubmit}
                    disabled={loading || !reportText.trim()}
                    size="medium"
                    sx={{ minWidth: 100 , textTransform: 'none' }}>
                    Submit
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default SuspiciousActivityReportPopup;