import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PlausibleDashboardPopup = ({ open, onClose }) => {
    const [embedError, setEmbedError] = useState(false);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Platform Growth Analytics
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2 }}>
                {!embedError ? (
                    <iframe 
                        data-plausible-embed="true"
                        src="https://plausible.io/share/procure-hub.up.railway.app?auth=-JlCCx3ZIrZCXwpzflvL_&embed=true&theme=light&realtime=true&pageview-props=true&events=true" 
                        scrolling="no" 
                        frameBorder="0" 
                        loading="lazy" 
                        style={{ 
                            width: '1px', 
                            minWidth: '100%', 
                            height: '2000px',
                            border: 'none'
                        }}
                        onError={() => setEmbedError(true)}
                    ></iframe>
                ) : (
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px'
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            No available data
                        </Typography>
                    </Box>
                )}
                <Box sx={{ 
                    fontSize: '14px', 
                    paddingBottom: '14px',
                    textAlign: 'center',
                    mt: 2
                }}>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PlausibleDashboardPopup; 