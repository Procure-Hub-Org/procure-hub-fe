import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ResponseTimeCard = ({ averageTime, title, subtitle }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {subtitle}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", my: 1 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
          {averageTime}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ml: 1, mb: 0.5 }}
        >
          hours
          {/* update in future (days, weekks...) */}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResponseTimeCard;
