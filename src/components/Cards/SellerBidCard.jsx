import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import BidDocumentUploader from "../Uploaders/BidDocumentUploader";
import PrimaryButton from "../Button/PrimaryButton";
import OutlinedButton from "../Button/OutlinedButton";

const SellerBidCard = ({ bid }) => {
  const submitted = bid.submitted_at !== null;
  const deadline = bid.procurementRequest.bid_edit_deadline;
  const now = dayjs();

  const isEditable = () => {
    if (submitted) return false;
    if (!deadline) return true;
    return now.isBefore(dayjs(deadline));
  };

  const editable = isEditable();
  const deadlinePassed = now.isAfter(dayjs(deadline));

  return (
    <Card
      sx={{
        width: 900,
        mx: "auto",
        mb: 3,
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#f9fafb",
          color: "#fff",
          borderBottom: "1px solid #e5e7eb",
          px: 3,
          py: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          color="textPrimary"
          sx={{ fontWeight: 600, fontSize: "1.25rem" }}
        >
          {bid.procurementRequest.title}
        </Typography>

        {!submitted && (
          <Chip
            label="Not Submitted"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          />
        )}

        {submitted && (
          <Chip
            label="Submitted"
            color="success"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#d1fae5", color: "#059669" }}
          />
        )}
      </Box>

      <CardContent sx={{ pb: 0 }}>
        <Typography
          variant="textPrimary"
          sx={{
            mt: 2,
            color: "#374151",
            textAlign: "center",
            px: 1,
            lineHeight: 3,
          }}
        >
          {bid.proposal_text}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={4} mt={3} px={3}>
          <Box flex="1 1 40%">
            <Typography variant="body2" color="text.secondary">
              Price:
            </Typography>
            <Typography variant="body1">{bid.price} KM</Typography>
          </Box>

          <Box flex="1 1 40%">
            <Typography variant="body2" color="text.secondary">
              Timeline:
            </Typography>
            <Typography variant="body1">{bid.timeline} days</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box px={3}>
          <Typography variant="body2" fontWeight={500} mb={1}></Typography>
          <BidDocumentUploader
            procurementBidId={bid.id}
            disabled={!editable || submitted}
          />
        </Box>
      </CardContent>

      <Box
        sx={{
          backgroundColor: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          px: 3,
          py: 2.1,
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Created: {dayjs(bid.created_at).format("MMM D, YYYY")}
        </Typography>

        {!submitted && editable && (
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Chip
              icon={<AccessTimeIcon />}
              label={
                deadline
                  ? `Edit Deadline: ${dayjs(deadline).format(
                      "DD.MM.YYYY HH:mm"
                    )}`
                  : "Edit Deadline: Not set"
              }
              color="error"
              variant="filled"
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <OutlinedButton>Edit</OutlinedButton>
            <PrimaryButton>Submit</PrimaryButton>
          </Box>
        )}

        {deadlinePassed && !submitted && (
          <Chip
            label="Deadline Passed"
            color="error"
            variant="filled"
            size="small"
            sx={{
              fontWeight: 500,
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default SellerBidCard;
