import { Typography, Box, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({
  data,
  xKey,
  yKey,
  barColor = "#4CAF50",
  title,
  subtitle,
}) => (
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
      <BarChart data={data}>
        <XAxis dataKey={xKey} tick={false} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default CustomBarChart;
