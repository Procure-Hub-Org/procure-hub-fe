import React from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import BasicButton from "../Button/BasicButton";

const Sidebar = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: "240px", // Fixed width for the sidebar
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "240px", // Ensuring the paper takes the same width
          backgroundColor: "#14110F", // Dark background like the homepage
          color: "#E3B34B", // Text color to match UI theme
          paddingTop: 2,
          display: "flex",
          flexDirection: "column", // Make sure the content is in a column layout
          justifyContent: "space-between", // To distribute space between items
          height: "100vh", // Ensure full height of the screen
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {/* Replace ListItem with BasicButton for consistent styling */}
          <ListItem button>
            <BasicButton onClick={() => console.log("Dashboard clicked")}>
              Dashboard
            </BasicButton>
          </ListItem>
          <ListItem button>
            <BasicButton onClick={() => console.log("My Bids clicked")}>
              My Bids
            </BasicButton>
          </ListItem>
          <ListItem button>
            <BasicButton onClick={() => console.log("Settings clicked")}>
              Settings
            </BasicButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
