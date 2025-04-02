import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/system';

const BasicButton = ({ children, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      sx={{
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        textTransform: 'none',
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
