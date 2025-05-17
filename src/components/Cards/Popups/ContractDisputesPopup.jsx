import React, { useState } from "react";
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

// mock data da vidim kako radi
const mockDisputes = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        company: "Acme Corp",
        text: "The delivery was late and missing key features.",
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        company: "Global Solutions",
        text: "Several terms in the contract were not fulfilled.",
    },
    {
        id: 3,
        firstName: "Jane",
        lastName: "Smith",
        company: "Global Solutions",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
    {
        id: 4,
        firstName: "Neko",
        lastName: "Nekic",
        company: "Neka Kompanija",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
    {
        id: 3,
        firstName: "Jane",
        lastName: "Smith",
        company: "Global Solutions",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
    {
        id: 4,
        firstName: "Neko",
        lastName: "Nekic",
        company: "Neka Kompanija",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
    {
        id: 3,
        firstName: "Jane",
        lastName: "Smith",
        company: "Global Solutions",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
    {
        id: 4,
        firstName: "Neko",
        lastName: "Nekic",
        company: "Neka Kompanija",
        text: "Iskreno nemam pojma sta da napisem ovdje",
    },
];

const ContractDisputeSubmit = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5" fontWeight="bold">Disputes for Contract</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {mockDisputes.map((dispute) => (
                        <Card key={dispute.id} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {dispute.firstName} {dispute.lastName} ({dispute.company})
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    {dispute.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <SecondaryButton
                    onClick={handleClose}
                    disabled={loading}
                    size="medium"
                    sx={{ minWidth: 100 , textTransform: 'none' }}>
                    Close
                </SecondaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default ContractDisputeSubmit;