import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/system';

const SecondaryButton = ({ children, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="secondary"
      sx={{
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        textTransform: 'none',
        padding: '12px 18px',
        borderRadius: '4px',
        boxShadow: 3,
        '&:hover': {
          backgroundColor: theme.palette.secondary.light,
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;
