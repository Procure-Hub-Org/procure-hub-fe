import React from 'react';
import { useTheme } from '@mui/material/styles';

const CustomInput = ({ type, value, onChange, placeholder, ...props }) => {
  const theme = useTheme();

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: `1px solid ${theme.palette.text.primary}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,       // Ensure text color is applied
        fontSize: '1rem',
        fontFamily: theme.typography.fontFamily,
        boxSizing: 'border-box', // Makes sure the padding doesn't affect the width
        caretColor: theme.palette.text.primary, // Optional: changes caret (cursor) color
      }}
      {...props}
    />
  );
};

export default CustomInput;
