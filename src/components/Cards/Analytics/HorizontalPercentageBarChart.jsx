import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import {
  ReferenceLine,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const getBarColor = (value) => {
  if (value < 0) return "#f44336";     // crveno
  if (value <= 25) return "#f48fb1";   // ružičasto
  if (value <= 75) return "#ffeb3b";   // žuto
  return "#2e7d32";                    // tamnozeleno
};

<ReferenceLine x={0} stroke="#999" />


const HorizontalPercentageBarChart = ({
  data,
  title,
  subtitle,
  height = 300,
  width = "100%",
}) => {
  // We expect data like [{ name: string, value: number }, ...]

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

      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Attribute names on left */}
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            width={190}
          />
          {/* Percentages on x-axis */}
          <XAxis
            type="number"
            domain={[
              (dataMin) => Math.min(-100, dataMin),
              (dataMax) => Math.max(100, dataMax)
            ]}
            tickFormatter={(tick) => `${tick}%`}
            axisLine={false}
            tickLine={false}
          />
            <ReferenceLine x={0} stroke="#999" />

          <Tooltip
            formatter={(value) => `${value}%`}
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
          />

        <Bar dataKey="value" isAnimationActive={false} maxBarSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(value) => `${value}%`}
            style={{ fontWeight: "bold", fill: "#000" }}
          />
        </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default HorizontalPercentageBarChart;
