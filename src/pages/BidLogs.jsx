import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout.jsx";
import { Box, Container, Typography, Paper, Stack, Card, CircularProgress } from "@mui/material";
import SecondaryButton from "../components/Button/SecondaryButton.jsx";
import { isAuthenticated, isAdmin } from "../utils/auth.jsx";
import axios from "axios";

import {
  FilePresent as FileIcon,
} from "@mui/icons-material";

import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import JpgIcon from '@mui/icons-material/Image';


function getIconForFileType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PdfIcon color="action" />;
    case 'doc':
    case 'docx':
      return <DocIcon color="action" />;
    case 'jpg':
    case 'png':
    case 'jpeg':
      return <JpgIcon color="action" />;
    // Add more cases for other file types if needed
    default:
      return <FileIcon color="action" />;
  }
}

const BidLogs = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [data, setData] = useState([]); // Initialize as an array
    const {requestId, bidId } = useParams(); // Get both requestId and bidId
    const [loading, setLoading] = useState(true);

    console.log("RequestID i BidId:", requestId, bidId);
    const handleClose = () => {
        console.log('Return to procurement preview!');
        navigate(-1);
    };

    useEffect(() => {
        if (!isAdmin()) {
            if (!isAuthenticated()) {
                window.location.href = "/login";
            } else {
                window.location.href = "/";
            }
            return;
        }

        // Fetch all bids for the requestId
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/procurement-bids/${requestId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach the JWT token here
            },
        })
            .then((response) => {
                console.log("Fetched all bid data for request:", response.data);
                setData(response.data); // Set data here
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching bid data:", error);
                setData({ notFound: true });
                setLoading(false);
            });
    }, [requestId]);

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

    console.log("Data to render:", data);  // Check the data structure here

    // nadji bid da matcha id-ju
    const bid = data[parseInt(bidId) - 1];

    if (!bid) {
        return (
            <Layout>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Typography variant="h6" color="error">No matching bid found.</Typography>
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
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
                    Bid Details
                </Typography>
                {/* Display the specific bid */}
                <Card sx={{ p: 3, mt: 3 }}>
                    <Typography variant="body1"><strong>Seller:</strong> {bid.seller}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Price:</strong> ${bid.price}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Delivery time:</strong> {bid.timeline}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Proposal text:</strong> {bid.proposal}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Submitted At:</strong> {bid.submitted_at ? new Date(bid.submitted_at).toLocaleString() : "N/A"}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}> Documentation</Typography>

                    {bid.documents && bid.documents.length > 0 && (
                        <Box mt={3} px={0} sx={{ width: "100%" }}>

                            {bid.documents.map((doc) => (
                            <Paper
                                key={doc.id}
                                sx={{
                                    p: 2,
                                    my: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                {getIconForFileType(doc.original_name)}
                                <Box>
                                    <Typography fontWeight="bold">
                                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">{doc.original_name}</a>
                                    </Typography>
                                </Box>
                                </Stack>

                            </Paper>
                            ))}
                        </Box>
                    )}

                    {bid.documents && bid.documents.length === 0 && (
                        <span className="value"> <br></br>
                            No documents have been uploaded.
                        </span>
                    )}

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
                        Admin Logs
                    </Typography>
                    {bid.adminLogs && bid.adminLogs.length > 0 ? (
                        bid.adminLogs.map((log, logIndex) => (
                            <Box key={logIndex} sx={{ mb: 2, border: '1px solid #ddd', padding: 2, borderRadius: 1 }}>
                                <Typography variant="body2">
                                    {log.action} - {new Date(log.created_at).toLocaleString()}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2">No admin logs available</Typography>
                    )}

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
                        Evaluations
                    </Typography>
                    {bid.score !== null ? (
                        <Box sx={{ mb: 2, border: '1px solid #ddd', padding: 2, borderRadius: 1 }}>
                            <Typography variant="body2">
                                Score: {bid.score}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2">No evaluations available</Typography>
                    )}
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <SecondaryButton onClick={handleClose}>Return to procurement</SecondaryButton>
                </Box>
            </Container>
        </Layout>
    );
};

export default BidLogs;