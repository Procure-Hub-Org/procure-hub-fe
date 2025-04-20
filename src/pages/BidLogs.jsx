import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout.jsx";
import { Box, Container, Typography, Card, CircularProgress } from "@mui/material";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";

const BidLogs = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleClose = () => {
        console.log('Return to procurement preview!');
        navigate(-1);
    };

    // Mock data
    const mockData = [
        {
            id: 2,
            seller: "Jane Smith",
            price: 2000,
            timeline: "2023-11-01 - 2023-11-10",
            proposal: "Advanced Proposal",
            submitted_at: "2023-11-01T10:00:00Z",
            adminLogs: [
                { action: "Bid submitted", created_at: "2023-11-01T10:00:00Z" },
                { action: "Bid updated", created_at: "2023-11-02T12:00:00Z" }
            ],
            evaluations: [
                { score: 9 }
            ]
        },
        {
            id: 1,
            seller: "John Doe",
            price: 1500,
            timeline: "2023-10-01 - 2023-10-10",
            proposal: "Basic Proposal",
            submitted_at: "2023-10-01T12:00:00Z",
            adminLogs: [
                { action: "Bid submitted", created_at: "2023-10-01T12:00:00Z" },
                { action: "Bid updated", created_at: "2023-10-02T14:00:00Z" }
            ],
            evaluations: [
                { score: 8 }
            ]
        }
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const selectedBid = mockData.find(bid => bid.id === parseInt(id));
            if (selectedBid) {
                setData(selectedBid);
            } else {
                setData({ notFound: true });
            }
            setLoading(false);
        }, 300);
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (data?.notFound) {
        return (
            <Layout>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Typography variant="h6" color="error">Bid not found!</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <SecondaryButton onClick={handleClose}>Return to procurement</SecondaryButton>
                    </Box>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <Card sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Bid Details
                    </Typography>
                    <Typography variant="body1"><strong>Seller:</strong> {data.seller}</Typography>
                    <Typography variant="body1"><strong>Price:</strong> ${data.price}</Typography>
                    <Typography variant="body1"><strong>Timeline:</strong> {data.timeline}</Typography>
                    <Typography variant="body1"><strong>Proposal:</strong> {data.proposal}</Typography>
                    <Typography variant="body1">
                        <strong>Submitted At:</strong> {data.submitted_at ? new Date(data.submitted_at).toLocaleString() : "N/A"}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
                        Admin Logs
                    </Typography>
                    {data.adminLogs.map((log, index) => (
                        <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', padding: 2, borderRadius: 1 }}>
                            <Typography variant="body2">
                                {log.action} - {new Date(log.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    ))}

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
                        Evaluations
                    </Typography>
                    {data.evaluations.map((evalItem, index) => (
                        <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', padding: 2, borderRadius: 1 }}>
                            <Typography variant="body2">
                                Score: {evalItem.score}
                            </Typography>
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <SecondaryButton onClick={handleClose}>Return to procurement</SecondaryButton>
                    </Box>
                </Card>
            </Container>
        </Layout>
    );
};

export default BidLogs;


