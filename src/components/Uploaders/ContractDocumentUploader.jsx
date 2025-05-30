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
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import JpgIcon from '@mui/icons-material/Image';

function getIconForFileType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PdfIcon color="action" />;
    case 'doc':
    case 'docx':
      return <DocIcon color="action" />;
    case 'jpg':
    case 'png':
    case 'jpeg':
      return <JpgIcon color="action" />;
    default:
      return <FileIcon color="action" />;
  }
}

const ContractDocumentUploader = ({ contractId, disabled }) => {
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
          `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/documents`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUploadedDocs(response.data);
      } catch (err) {
        console.error("Error fetching uploaded documents:", err);
        setError("Failed to fetch uploaded documents.");
      }
    };

    fetchUploadedDocs();
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
    setError(errors.join(" "));
  };

  const handleDrop = (e) => {
    if (disabled) return;
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
    setError(errors.join(" "));
  };

  const handleRemoveLocalFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async (file) => {
    if (disabled) return;
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
      setUploadedDocs((prev) => [...prev, res.data]);
      setFiles((prev) => prev.filter((f) => f !== file));
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Unexpected error during upload.");
    }
  };

  const handleDelete = async (docId) => {
    if (disabled) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/contracts/${contractId}/remove-document`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { documentId: docId },
        }
      );
      setUploadedDocs((prev) => prev.filter((doc) => doc.id !== docId));
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
            {files.map((file, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 2,
                  my: 1,
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
                  <SecondaryButton
                    variant="outlined"
                    size="small"
                    onClick={() => handleUpload(file)}
                  >
                    Upload
                  </SecondaryButton>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveLocalFile(idx)}
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
          </Box>
        </Paper>
      )}

      {uploadedDocs.length > 0 && (
        <Box mt={disabled ? 0 : 3} px={disabled ? 0 : 0} sx={{ width: "100%" }}>
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
                {getIconForFileType(doc.original_name)}
                <Box>
                  <Typography fontWeight="bold">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">{doc.original_name}</a>
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                color="error"
                onClick={() => handleDelete(doc.id)}
                disabled={disabled}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {disabled && uploadedDocs.length === 0 && (
        <Typography variant="body2" mt={3} color="textSecondary">
          No documents have been uploaded.
        </Typography>
      )}
    </Box>
  );
};

export default ContractDocumentUploader;
