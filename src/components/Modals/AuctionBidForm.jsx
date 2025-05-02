import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import PrimaryButton from "../Button/PrimaryButton";
import OutlinedButton from "../Button/OutlinedButton";
import CloseIcon from "@mui/icons-material/Close";

const AuctionBidForm = ({
  open,
  onClose,
  onSubmit,
  currentBid,
  minimumDecrement = 100,
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setBidAmount((currentBid - minimumDecrement).toFixed());
      setError("");
    }
  }, [open, currentBid, minimumDecrement]);

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid)) {
      setError("Enter a valid number.");
      return;
    }
    if (numericBid >= currentBid - minimumDecrement) {
      setError(
        `Bid must be at least $${minimumDecrement} less than the current bid.`
      );
      return;
    }
    onSubmit(numericBid);
    setBidAmount("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Submit Your Bid
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Bid Amount"
            type="number"
            value={bidAmount}
            onChange={handleBidChange}
            fullWidth
            InputProps={{
              startAdornment: <span>$</span>,
              inputProps: {
                step: minimumDecrement,
                min: 0,
              },
            }}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <OutlinedButton onClick={onClose} variant="outlined">
          Cancel
        </OutlinedButton>
        <PrimaryButton
          onClick={handleSubmit}
          variant="contained"
          disabled={!bidAmount}
        >
          Send
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default AuctionBidForm;
