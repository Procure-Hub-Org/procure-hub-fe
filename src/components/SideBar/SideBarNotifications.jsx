import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { isAuthenticated } from "../../utils/auth";
import axios from "axios";

const SidebarNotifications = ({ open, onClose, onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("id"));
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };
  useEffect(() => {
    if (open) {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedNotifications = response.data.data;
          setNotifications(fetchedNotifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [open, token, userId]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 360,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 360,
          paddingTop: 2,
          paddingX: 2,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: "bold",
          borderBottom: "2px solid #e0e0e0",
          pb: 1,
          textAlign: "center",
          color: "#333",
        }}
      >
        Notifications
      </Typography>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, color: "gray" }}>
              No notifications yet.
            </Typography>
          ) : (
            notifications.map((notif, index) => (
                <ListItem
                key={index}
                onClick={() => onNotificationClick(notif.contract_id)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                  boxShadow: 1,
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {notif.procurement_request_title}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {notif.text}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(notif.created_at)}
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarNotifications;
