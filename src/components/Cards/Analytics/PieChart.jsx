import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const CustomPieChart = ({ data, colors, title, subtitle }) => {
  return (
    <Paper elevation={3} sx={{ px: 3, py: 3,borderRadius: 2 }}>
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
                   
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CustomPieChart;
