import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../styles/AdminContractLogsPopup.css";
import PrimaryButton from "../components/Button/PrimaryButton"; 
//for audit report
import { generateContractAuditReportPDF } from "../services/pdfContractService";



const ContractLogsPopup = ({ open, onClose, logs }) => {

    const handlePrintReport = () => {
        generateContractAuditReportPDF(logs);
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="contract-dialog-title">Contract Activity Logs</DialogTitle>

      <DialogContent className="contract-dialog-content">
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
