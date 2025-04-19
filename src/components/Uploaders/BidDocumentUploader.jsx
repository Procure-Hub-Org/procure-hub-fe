import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Divider,
  Alert,
  Collapse,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  FilePresent as FileIcon,
} from "@mui/icons-material";
import axios from "axios";
import PrimaryButton from "../Button/PrimaryButton";
import SecondaryButton from "../Button/SecondaryButton";

const BidDocumentUploader = ({ procurementBidId }) => {
  const [files, setFiles] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [error, setError] = useState("");

  const maxSize = 50 * 1024 * 1024;
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  useEffect(() => {
    const fetchUploadedDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/procurement-bid/${procurementBidId}/bid-documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUploadedDocs(response.data);
      } catch (err) {
        console.error("Error fetching uploaded documents:", err);
        setError("Failed to fetch uploaded documents.");
      }
    };

    fetchUploadedDocs();
  }, [procurementBidId]);

  const validateFile = (file) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return `File "${
        file.name
      }" has an unsupported extension. Allowed: ${allowedExtensions.join(
        ", "
      )}`;
    }
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds the maximum size of 50MB.`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const errors = [];

    const validFiles = selectedFiles.filter((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    if (errors.length) setError(errors.join(" "));
    else setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const errors = [];

    const validFiles = droppedFiles.filter((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    if (errors.length) setError(errors.join(" "));
    else setError("");
  };

  const handleRemoveLocalFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("procurement_bid_id", procurementBidId);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bid-documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000
        }
      );
      setUploadedDocs((prev) => [...prev, res.data.bidDocument]);
      setFiles((prev) => prev.filter((f) => f !== file));
      setError("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unexpected error occurred during upload.");
      }
    }
  };

  const handleDelete = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/bid-documents/${docId}/remove`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUploadedDocs((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (err) {
      console.error("Error removing a document: ", err);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 800,
          p: 4,
          border: "2px dashed #90caf9",
          textAlign: "center",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Typography variant="h6" gutterBottom>
          Add supporting documents
        </Typography>

        <PrimaryButton
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
        >
          Choose files
          <input type="file" hidden multiple onChange={handleFileChange} />
        </PrimaryButton>

        <Box mt={3}>
          {files.map((file, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                my: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 4,
                bgcolor: "#e3f2fd",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <FileIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {file.type}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <SecondaryButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleUpload(file)}
                >
                  Upload
                </SecondaryButton>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveLocalFile(index)}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          ))}

          <Collapse in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mt: 3, textAlign: "left" }}
            >
              {error}
            </Alert>
          </Collapse>

          {uploadedDocs.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" gutterBottom>
                Uploaded Documents
              </Typography>

              {uploadedDocs.map((doc) => (
                <Paper
                  key={doc.id}
                  sx={{
                    p: 2,
                    my: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FileIcon color="action" />
                    <Box>
                      <Typography fontWeight="bold">
                        {doc.original_name}
                      </Typography>
                    </Box>
                  </Stack>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Delete />
                  </IconButton>
                </Paper>
              ))}
            </>
          )}
        </Box>

        {!files.length && !uploadedDocs.length && (
          <Typography variant="body2" mt={3} color="textSecondary">
            Drag and drop files here or click the button to upload.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default BidDocumentUploader;
