import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import BidDocumentUploader from "../Uploaders/BidDocumentUploader";
import PrimaryButton from "../Button/PrimaryButton";
import OutlinedButton from "../Button/OutlinedButton";
import SuspiciousActivityReportPopup from "./Popups/SuspiciousActivityReportPopup.jsx";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred"; // optional icon

const SellerBidCard = ({ bid }) => {
  const navigate = useNavigate();
  const submitted = bid.submitted_at !== null;
  const editDeadline = bid.procurementRequest.bid_edit_deadline;
  const procurementRequestdeadline = bid.procurementRequest.deadline;
  const now = dayjs();

  const [reportOpen, setReportOpen] = useState(false);
  const suspiciousAlreadyReported = bid.suspicious_report_submitted;
  const showReportButton = !suspiciousAlreadyReported;


    const handleReportSubmit = (text) => {
      // Replace with actual API call
      console.log("Submitting suspicious report:", text);
      // Optional: disable the button, reload, show toast, etc.
  };

  const isEditable = () => {
    if (submitted) return false;
    if (!editDeadline) return true;
    return now.isBefore(dayjs(editDeadline));
  };

  const isDocumentsDeadlinePassed = () => {
    if (submitted) return false;
    if (!procurementRequestdeadline) return true;
    return now.isBefore(dayjs(procurementRequestdeadline));
  };

  const documentsDeadlinePassed = isDocumentsDeadlinePassed();
  const editable = isEditable();
  const deadlinePassed = now.isAfter(dayjs(editDeadline));

  const handleEdit = () => {
    if (editable) {
      navigate(`/edit-bid/${bid.id}`, {
        state: {
          formData: {
            price: bid.price,
            timeline: bid.timeline,
            proposal_text: bid.proposal_text,
          },
        },
      });
    } else {
      alert("Bid can not be edited!");
    }
  };

  

  const handleSubmit = async () => {
    const formData = {
      price: bid.price,
      timeline: bid.timeline,
      proposal_text: bid.proposal_text,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bid/${bid.id}/submit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Bid submitted successfully!");
        navigate("/seller-bids");
        window.location.reload();
      } else {
        alert("Bid submission failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred while submitting the bid.");
    }
  };

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
            <Typography variant="body1">{bid.price} $</Typography>
          </Box>

          <Box flex="1 1 40%">
            <Typography variant="body2" color="text.secondary">
              Delivery Time:
            </Typography>
            <Typography variant="body1">{bid.timeline}</Typography>
          </Box>

          <Box flex="1 1 40%">
            <Typography variant="body2" color="text.secondary">
              Buyer:
            </Typography>
            <Typography variant="body1">
              {bid.procurementRequest?.buyer?.first_name}{" "}
              {bid.procurementRequest?.buyer?.last_name} (
              {bid.procurementRequest?.buyer?.company_name})
            </Typography>
          </Box>

          <Box flex="1 1 40%">
            <Typography variant="body2" color="text.secondary">
              Procurement Request Deadline:
            </Typography>
            <Typography variant="body1">
              {bid.procurementRequest?.deadline
                ? dayjs(bid.procurementRequest.deadline).format(
                    "DD.MM.YYYY HH:mm"
                  )
                : "N/A"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box px={3}>
          <Typography variant="body2" fontWeight={500} mb={1}></Typography>
          <BidDocumentUploader
            procurementBidId={bid.id}
            disabled={!documentsDeadlinePassed || submitted}
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

        <SuspiciousActivityReportPopup
            open={reportOpen}
            onClose={() => setReportOpen(false)}
            procurementTitle={bid.procurementRequest.title}
            procurementRequestId={bid.procurementRequest.id}
            onSubmit={handleReportSubmit}
        />
        {showReportButton && (
            <Box textAlign="center">
                <PrimaryButton
                    onClick={() => setReportOpen(true)}
                    disabled={suspiciousAlreadyReported}
                    startIcon={<ReportGmailerrorredIcon />}
                >
                    {suspiciousAlreadyReported
                        ? "Report Submitted"
                        : "Report Suspicious Activity"}
                </PrimaryButton>
            </Box>
        )}

        {!submitted && editable && documentsDeadlinePassed && (
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Chip
              icon={<AccessTimeIcon />}
              label={
                editDeadline
                  ? `Edit Deadline: ${dayjs(editDeadline).format(
                      "DD.MM.YYYY HH:mm"
                    )}`
                  : "No edit enabled"
              }
              color="error"
              variant="filled"
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <OutlinedButton onClick={handleEdit} disabled={!editDeadline}>
              {" "}
              Edit{" "}
            </OutlinedButton>
            <PrimaryButton onClick={handleSubmit}> Submit </PrimaryButton>
          </Box>
        )}

        {( !documentsDeadlinePassed) && !submitted && (
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
