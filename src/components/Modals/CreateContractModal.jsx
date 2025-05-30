import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import SecondaryButton from "../Button/SecondaryButton";
import PrimaryButton from "../Button/PrimaryButton";
import ContractDocumentUploader from "../Uploaders/ContractDocumentUploader";
import axios from "axios";

const ContractFormModal = ({ open, onClose, procurementRequest, bid, contract }) => {
const [contractData, setContractData] = useState({
  price: contract?.price || bid?.bidAuctionPrice || "",
  timeline: contract?.timeline || bid?.deliveryTime || "",
  policy: contract?.payment_instructions?.policy || "",
  payments: contract?.payment_instructions?.payments || [{ date: "", amount: "" }],
});


  const [contractId, setContractId] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [step, setStep] = useState(1);
  const isEdit = !!contract;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setContractData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (index, field, value) => {
    const updated = [...contractData.payments];
    updated[index][field] = value;
    setContractData((prev) => ({ ...prev, payments: updated }));
  };

  const addPayment = () => {
    setContractData((prev) => ({
      ...prev,
      payments: [...prev.payments, { date: "", amount: "" }],
    }));
  };

  const removePayment = (index) => {
    const updated = contractData.payments.filter((_, i) => i !== index);
    setContractData((prev) => ({ ...prev, payments: updated }));
  };

const handleSave = async (status) => {
  try {
    const token = localStorage.getItem("token");
    const url = contract
      ? `${import.meta.env.VITE_API_URL}/api/contracts/${contract.id}`
      : `${import.meta.env.VITE_API_URL}/api/new-contract`;

    const method = contract ? "put" : "post";

    const response = await axios({
      method: method,
      url: url,
      data: {
        procurement_request_id: procurementRequest.id,
        bid_id: bid.id,
        price: contractData.price,
        timeline: contractData.timeline,
        payment_instructions: {
          policy: contractData.policy,
          payments: contractData.payments,
        },
        status: status,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newContractId = contract ? contract.id : response.data.contractId;
    setContractId(newContractId);
    setStep(2);

    console.log(`${contract ? "Contract updated" : "Contract created"}:`, newContractId);
  } catch (error) {
    console.error("Error saving contract:", error.response?.data || error.message);
    alert("Error saving contract. Please try again.");
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{procurementRequest.title}</DialogTitle>
      <DialogContent dividers>
        {(step === 1 || isEdit) && (
          <>
            <TextField
              label="Contract Price"
              name="price"
              type="number"
              value={contractData.price}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="Delivery Time"
              name="timeline"
              value={contractData.timeline}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Payment Instructions
            </Typography>

            <TextField
              label="Policy"
              name="policy"
              value={contractData.policy}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            {contractData.payments.map((payment, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  label="Payment Date"
                  type="date"
                  value={payment.date}
                  onChange={(e) =>
                    handlePaymentChange(index, "date", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Payment Amount"
                  type="number"
                  value={payment.amount}
                  onChange={(e) =>
                    handlePaymentChange(index, "amount", e.target.value)
                  }
                  fullWidth
                  required
                />
                {contractData.payments.length > 1 && (
                  <SecondaryButton
                    onClick={() => removePayment(index)}
                    sx={{ mt: 1 }}
                  >
                    Remove Payment
                  </SecondaryButton>
                )}
              </Box>
            ))}

            <PrimaryButton onClick={addPayment} fullWidth sx={{ mb: 2 }}>
              + Add Payment
            </PrimaryButton>
          </>
        )}

        {(step === 2 || isEdit) && (
          <Box
            sx={{
              border: "1px solid #1976d2",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ mb: 2 }}>
              Upload your contract documents (optional):
            </Typography>
            <ContractDocumentUploader
              contractId={contractId || contract?.id}
              disabled={disabled}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {isEdit ? (
          <>
            <PrimaryButton onClick={() => handleSave("draft")}>
              Save Changes
            </PrimaryButton>
            <PrimaryButton onClick={onClose}>Close</PrimaryButton>
          </>
        ) : step === 1 ? (
          <>
            <PrimaryButton onClick={() => handleSave("draft")}>
              Save as Draft
            </PrimaryButton>
            <PrimaryButton
              onClick={() => handleSave("issued")}
              variant="contained"
              color="primary"
            >
              Issue Contract
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton onClick={onClose}>Close</PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContractFormModal;
