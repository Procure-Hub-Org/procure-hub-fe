/*import React from 'react';
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

export default BasicButton;*/

import React from 'react';
import { Button } from '@mui/material';

const BasicButton = ({ children, onClick }) => {
  return (
    <Button
      variant="text"
      sx={{
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        color: '#E3B34B',
        '&:hover': {
          color: '#FFD369',
        },
        margin: '0 10px',
        padding: '8px 16px',
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default BasicButton;