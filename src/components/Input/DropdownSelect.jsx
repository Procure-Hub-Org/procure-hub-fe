import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomSelect = ({ label, value, onChange, options, helperText, error, ...props }) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth margin="normal" variant="outlined" error={error}>
      {/* InputLabel */}
      <InputLabel style={{ color: theme.palette.text.primary }} error={error}>
        {label}
      </InputLabel>

      {/* Select Component */}
      <Select
        value={value}
        onChange={onChange}
        // displayEmpty smeta ovo
        label={label}
        inputProps={{
          style: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
          },
        }}
        {...props}
      >
        {/* Empty option for the placeholder text */}
        <MenuItem value="" disabled>
          {/* Select an option     smeta ovo */} 
        </MenuItem>

        {/* Mapping over options */}
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {/* Helper text */}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
