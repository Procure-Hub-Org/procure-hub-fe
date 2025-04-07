import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmModal = ({ open, onClose, message, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Are you sure?
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "24px" }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
