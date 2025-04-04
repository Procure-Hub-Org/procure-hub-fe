import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CustomSearchInput = ({ value, onChange, ...props }) => {
  const theme = useTheme();

  return (
    <TextField
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      margin="normal"
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search style={{ color: theme.palette.text.primary }} />
          </InputAdornment>
        ),
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

export default CustomSearchInput;
