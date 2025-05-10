import React, { useEffect, useState } from "react";
import { Snackbar, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { useToast } from "../../context/ToastContext"; 
const SuccessOrErrorToast = () => {
  const theme = useTheme();
  const { toast, hideToast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (toast.show) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        hideToast(); 
      }, 3000); // dissappear after 3 seconds 

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast.show) return null;

  const backgroundColor =
    toast.type === "success" ? theme.palette.success.main : theme.palette.error.main;
  const textColor =
    toast.type === "success" ? theme.palette.success.contrastText : theme.palette.error.contrastText;

  return (
    <Snackbar
      open={open}
      onClose={() => {
        setOpen(false);
        hideToast();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Box
        sx={{
          backgroundColor: backgroundColor,
          padding: "8px 16px",
          borderRadius: "8px",
          color: textColor,
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
          {toast.message}
        </Typography>
      </Box>
    </Snackbar>
  );
};

export default SuccessOrErrorToast;
