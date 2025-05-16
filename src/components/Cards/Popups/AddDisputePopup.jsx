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

const AddDisputePopup = ({ open, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // You can plug in your API logic here
            await onSubmit({ title, text });
            setTitle('');
            setText('');
            onClose();
        } catch (e) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setTitle('');
            setText('');
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" gutterBottom>
                Submit Dispute for Contract: <strong>{'Unnamed Contract'}</strong>
            </DialogTitle>
            <DialogContent>
                <Card variant="outlined">
                    <CardContent>
                        <Typography>Please provide a detailed description of the
                            issue you are experiencing with this contract.</Typography>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Dispute Description"
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
                    sx={{ minWidth: 100 , textTransform: 'none' }}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton
                    onClick={handleSubmit}
                    disabled={loading || !text || !title}
                    size="medium"
                    sx={{ minWidth: 100 , textTransform: 'none' }}>
                    Submit
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddDisputePopup;