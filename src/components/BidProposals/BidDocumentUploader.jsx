import React, { useState } from "react";
import { Box, Paper, Typography, Button, IconButton, Stack, Divider } from "@mui/material";
import { CloudUpload, Delete, Edit, FilePresent as FileIcon } from "@mui/icons-material";
import axios from "axios";
import PrimaryButton from "../Button/PrimaryButton";
import SecondaryButton from "../Button/SecondaryButton";

const BidDocumentUploader = ({ procurementBidId }) => {
  const [files, setFiles] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/bid-documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadedDocs((prev) => [...prev, res.data.bidDocument]);
      setFiles((prev) => prev.filter((f) => f !== file));
    } catch (err) {
      console.error("Error adding a document:", err);
    }
  };

  const handleDelete = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/bid-documents/${docId}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedDocs((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (err) {
      console.error("Error removing a document: ", err);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 700,
        mx: "auto",
        mt: 5,
        border: "2px dashed #90caf9",
        textAlign: "center",
        bgcolor: "#f5f5f5",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Typography variant="h6" gutterBottom>
        Add suporting documents
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
              bgcolor: "#e3f2fd",
              gap: 4,
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
                    <Typography variant="body2" color="text.secondary">
                      {/* {doc.file.mimetype} */}
                    </Typography>
                  </Box>
                </Stack>

                <IconButton color="error" onClick={() => handleDelete(doc.id)}>
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
  );
};

export default BidDocumentUploader;
