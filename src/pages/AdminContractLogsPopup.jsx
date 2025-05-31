import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../styles/AdminContractLogsPopup.css";
import PrimaryButton from "../components/Button/PrimaryButton"; 
import axios from "axios";
//for audit report
import { generateContractAuditReportPDF } from "../services/pdfContractService";



const ContractLogsPopup = ({ open, onClose, contractId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);

   //Fetch logs when popup opens
 useEffect(() => {
  if (open && contractId) {
    setLoading(true);

    // Pokreni oba zahtjeva paralelno
    Promise.all([
      axios.get(`/contracts/${contractId}`),       // Detalji ugovora
      axios.get(`/contracts/${contractId}/logs`)   // Logovi
    ])
    .then(([contractRes, logsRes]) => {
      // Ako je vraćeni contract niz, uzmi prvi element
      const contractData = Array.isArray(contractRes.data) ? contractRes.data[0] : contractRes.data;
      setContractDetails(contractData);
      setLogs(logsRes.data || []);
    })
    .catch((error) => {
      console.error("Failed to fetch contract info or logs:", error);
      setContractDetails(null);
      setLogs([]);
    })
    .finally(() => setLoading(false));
  }
}, [open, contractId]);

/*
useEffect(() => {
  if (open && contractId) {
    setLoading(true);

    / MOCK PODACI
    const mockContract = {
      procurement_request_title: "Laptop Procurement",
      procurement_category: "IT Equipment",
      buyer_name: "John Doe",
      buyer_company_name: "TechCorp d.o.o.",
      seller_name: "Harun Mioč",
      seller_company_name: "SupplyX",
      price: 18500,
      status: "Approved",
      award_date: "2025-05-30T13:45:00Z",
      number_of_disputes: 2,
    };

    const mockLogs = [
      {
        created_at: "2025-05-30T14:00:00Z",
        user: { name: "Jane Smith" },
        action: "Contract created",
      },
      {
        created_at: "2025-05-31T10:30:00Z",
        user: { name: "Scarlet Johanson" },
        action: "Buyer approved contract",
      },
      {
        created_at: "2025-06-01T09:00:00Z",
        user: { name: "Harun Mioč" },
        action: "Seller confirmed contract",
      },
    ];

    // Simuliraj API kašnjenje
    setTimeout(() => {
      setContractDetails(mockContract);
      setLogs(mockLogs);
      setLoading(false);
    }, 500);
  }
}, [open, contractId]);
*/
    const handlePrintReport = () => {
      generateContractAuditReportPDF(contractDetails, logs);
    };

 return (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle className="contract-dialog-title">Contract Activity Logs</DialogTitle>

    <DialogContent className="contract-dialog-content">
      {contractDetails && (
        <div className="contract-details mb-4">
          <p><strong>Request:</strong> {contractDetails.procurement_request_title}</p>
          <p><strong>Category:</strong> {contractDetails.procurement_category || "N/A"}</p>
          <p><strong>Buyer:</strong> {contractDetails.buyer_name} ({contractDetails.buyer_company_name})</p>
          <p><strong>Seller:</strong> {contractDetails.seller_name} ({contractDetails.seller_company_name})</p>
          <p><strong>Price:</strong> {contractDetails.price} KM</p>
          <p><strong>Status:</strong> {contractDetails.status}</p>
          <p><strong>Award Date:</strong> {new Date(contractDetails.award_date).toLocaleString()}</p>
          <p><strong>Disputes:</strong> {contractDetails.number_of_disputes}</p>
        </div>
      )}

      {logs.length === 0 ? (
        <p className="contract-no-logs">No activity logs found for this contract.</p>
      ) : (
        <table className="contract-logs-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.user?.name || "Unknown"}</td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DialogContent>

    <DialogActions className="contract-dialog-actions">
      <PrimaryButton onClick={handlePrintReport}>Print Audit Report</PrimaryButton>
      <Button onClick={onClose} variant="outlined" color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
};

export default ContractLogsPopup;
