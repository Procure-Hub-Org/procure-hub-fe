import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/system';

const OutlinedButton = ({ children, onClick, color = "primary", ...props  }) => {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      color={color}
      sx={{
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        textTransform: 'none',
        padding: '6px 14px',
        borderRadius: '4px',
        borderColor: color === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main,
        '&:hover': {
          borderColor: color === 'primary' ? theme.palette.primary.dark : theme.palette.secondary.dark,
          backgroundColor: color === 'primary' ? theme.palette.primary.light : theme.palette.secondary.light,
        },
      }}
      {...props}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default OutlinedButton;
