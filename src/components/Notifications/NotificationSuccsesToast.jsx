import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSuccsesToast = ({ message, autoHideDuration = 3000, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSuccsesToast;