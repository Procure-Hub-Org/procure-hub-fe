import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/system";

const BasicButton = ({ children, onClick, color, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      sx={{
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        textTransform: "none",
        color: color || theme.palette.primary.contrastText, // Use passed color or default to theme's contrastText
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
        },
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
/*
import React from 'react';
import { Button } from '@mui/material';

const BasicButton = ({ children, onClick, ...props }) => {
  return (
    <Button
      variant="text"
      sx={{
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        color: '#E3B34B',
        '&:hover': {
          color: '#FFD369',
        },
        margin: '0 10px',
        padding: '8px 16px',
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
*/
