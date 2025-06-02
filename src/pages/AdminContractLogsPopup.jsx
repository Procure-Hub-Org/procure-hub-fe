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
      const token = localStorage.getItem("token");

      const fetchData = async () => {
        setLoading(true);

        try {
          const [contractRes, logsRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/api/contracts/${contractId}`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/logs`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
          ]);

          const contractData = Array.isArray(contractRes.data)
            ? contractRes.data[0]
            : contractRes.data;

          setContractDetails(contractData);
          setLogs(logsRes.data.logs || []);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setContractDetails(null);
          setLogs([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setContractDetails(null);
      setLogs([]);
    }
  }, [open, contractId]);

    const handlePrintReport = () => {
      generateContractAuditReportPDF(contractDetails, logs);
    };

 return (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle fontWeight="bold">Contract Activity Logs</DialogTitle>

    <DialogContent className="contract-dialog-content">
      {contractDetails && (
        <div className="contract-details mb-2 ">
          <p><strong>Request:</strong> {contractDetails.procurement_request_title}</p>
          <p><strong>Category:</strong> {contractDetails.procurement_category || "N/A"}</p>
          <p><strong>Buyer:</strong> {contractDetails.buyer_name} ({contractDetails.buyer_company_name})</p>
          <p><strong>Seller:</strong> {contractDetails.seller_name} ({contractDetails.seller_company_name})</p>
          <p><strong>Price:</strong> {contractDetails.price} $</p>
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
            {logs && logs.length > 0 && logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.user ? `${log.user.first_name} ${log.user.last_name}` : "Unknown"}</td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DialogContent>

    <DialogActions className="contract-dialog-actions">
      <PrimaryButton onClick={() => handlePrintReport()}>Print Audit Report</PrimaryButton>
      <Button onClick={onClose} variant="outlined" color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
};

export default ContractLogsPopup;
