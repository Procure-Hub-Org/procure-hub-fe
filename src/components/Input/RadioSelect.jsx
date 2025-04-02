import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomRadioGroup = ({ label, value, onChange, options }) => {
  const theme = useTheme();

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio style={{ color: theme.palette.primary.main }} />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioGroup;