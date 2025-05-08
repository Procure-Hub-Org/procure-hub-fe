import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/system';

const PrimaryButton = ({ children, onClick, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        textTransform: 'none', // prevent uppercase transformation
        padding: '6px 14px',
        borderRadius: '4px',
        boxShadow: 3,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      }}
      //type={type} // nije radilo submit
      {...props}  // sad moze sve
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
