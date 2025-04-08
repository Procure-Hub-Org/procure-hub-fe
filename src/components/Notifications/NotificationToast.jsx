import React, { useState } from "react";
import { Snackbar, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";

const NotificationToast = ({ message, autoHideDuration }) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false); // State to control visibility of the toast

  // Show toast when the component is mounted
  React.useEffect(() => {
    setOpen(true);
    // Auto-hide after the specified duration
    const timer = setTimeout(() => {
      setOpen(false);
    }, autoHideDuration);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [autoHideDuration]);

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position at the bottom center
    >
      <Box
        sx={{
          backgroundColor: theme.palette.info.main, // Adjusting color to fit UI theme
          padding: "8px 16px",
          borderRadius: "8px",
          color: theme.palette.primary.main, // Text color (matches background color of home)
          fontFamily: '"Montserrat", sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          {message}
        </Typography>
      </Box>
    </Snackbar>
  );
};

export default NotificationToast;
