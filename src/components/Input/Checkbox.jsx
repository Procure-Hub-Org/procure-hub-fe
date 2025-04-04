import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomCheckbox = ({ label, checked, onChange }) => {
  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          style={{
            color: theme.palette.primary.main,
          }}
        />
      }
      label={label}
    />
  );
};

export default CustomCheckbox;