import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const CustomLineChart = ({
  data,
  xKey,
  yKey,
  lineColor = "#8884d8",
  title,
  subtitle,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box mb={2}>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="subtitle2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} 
            tickLine={false}
           />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={lineColor}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CustomLineChart;
