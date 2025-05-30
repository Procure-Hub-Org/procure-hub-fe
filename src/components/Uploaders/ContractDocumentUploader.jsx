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
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import DocIcon from "@mui/icons-material/Description";
import JpgIcon from "@mui/icons-material/Image";

function getIconForFileType(fileName) {
    if (!fileName) {
    return <FileIcon color="action" />;
  }
    console.log("filename", fileName);
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return <PdfIcon color="action" />;
    case "doc":
    case "docx":
      return <DocIcon color="action" />;
    case "jpg":
    case "png":
    case "jpeg":
      return <JpgIcon color="action" />;
    default:
      return <FileIcon color="action" />;
  }
}

const ContractDocumentUploader = ({ contractId, disabled }) => {
  const [file, setFile] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [error, setError] = useState("");

  const maxSize = 50 * 1024 * 1024;
  const allowedExtensions = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"];

  useEffect(() => {
    const fetchUploadedDoc = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/documents`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUploadedDoc(response.data || null);
      } catch (err) {
        console.error("Error fetching uploaded document:", err);
        setError("Failed to fetch uploaded document.");
      }
    };

    fetchUploadedDoc();
  }, [contractId]);

  const validateFile = (file) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return `File "${file.name}" has an unsupported extension. Allowed: ${allowedExtensions.join(", ")}`;
    }
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds the maximum size of 50MB.`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    if (disabled) return;
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const error = validateFile(selectedFile);
    if (error) {
      setError(error);
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDrop = (e) => {
    if (disabled) return;
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    const error = validateFile(droppedFile);
    if (error) {
      setError(error);
    } else {
      setFile(droppedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (disabled || !file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/add-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );
      setUploadedDoc(res.data);
      console.log("File uploaded successfully:", res.data);
      setFile(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Unexpected error during upload.");
    }
  };

  const handleDelete = async () => {
    if (disabled || !uploadedDoc) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/remove-document`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { documentId: uploadedDoc.id },
        }
      );
      setUploadedDoc(null);
    } catch (err) {
      console.error("Error removing document:", err);
    }
  };

  return (
    <Box>
      {!disabled && (
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            p: 2,
            border: "2px dashed #90caf9",
            textAlign: "center",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Typography variant="h6" gutterBottom>
            Add a supporting document
          </Typography>

          <PrimaryButton
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mt: 2 }}
          >
            Choose file
            <input type="file" hidden onChange={handleFileChange} />
          </PrimaryButton>

          {file && (
            <Paper
              sx={{
                p: 2,
                my: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#f9fafb",
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
                <SecondaryButton variant="outlined" size="small" onClick={handleUpload}>
                  Upload
                </SecondaryButton>
                <IconButton color="error" onClick={() => setFile(null)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          )}

          <Collapse in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mt: 3, textAlign: "left" }}
            >
              {error}
            </Alert>
          </Collapse>
        </Paper>
      )}

      {uploadedDoc && (
        <Box mt={disabled ? 0 : 3} sx={{ width: "100%" }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Document
          </Typography>

          <Paper
            sx={{
              p: 2,
              my: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {getIconForFileType(uploadedDoc.original_name)}
              <Box>
                <Typography fontWeight="bold">
                  <a href={uploadedDoc.file_url} target="_blank" rel="noopener noreferrer">
                    {uploadedDoc.original_name}
                  </a>
                </Typography>
              </Box>
            </Stack>

            <IconButton
              color="error"
              onClick={handleDelete}
              disabled={disabled}
            >
              <Delete />
            </IconButton>
          </Paper>
        </Box>
      )}

      {disabled && !uploadedDoc && (
        <Typography variant="body2" mt={3} color="textSecondary">
          No document has been uploaded.
        </Typography>
      )}
    </Box>
  );
};

export default ContractDocumentUploader;
