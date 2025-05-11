import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ResponseTimeCard = ({ averageTime, title, subtitle }) => {
  const displayTime = averageTime < 1 ? Math.round(averageTime * 60) : averageTime;
  const displayUnit = averageTime < 1 ? "minutes" : "hours";
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
           {displayTime}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ml: 1, mb: 0.5 }}
        >
         {displayUnit}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResponseTimeCard;
