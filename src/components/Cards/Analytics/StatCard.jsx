import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, change, color = "primary" }) => {
  const isPositive = change >= 0;
  const changeText = isPositive ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`;

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        p: 1,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
