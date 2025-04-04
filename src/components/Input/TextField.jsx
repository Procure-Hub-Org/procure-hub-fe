import React from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomTextField = ({ label, value, onChange, ...props }) => {
  const theme = useTheme();
  
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      margin="normal"
      InputLabelProps={{
        style: {
          color: theme.palette.text.primary,
        },
      }}
      InputProps={{
        style: {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;
