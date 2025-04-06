import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { defaultTheme, grayscaleTheme } from '../theme/theme'; // Import both themes

//context that can be used to switch between the default and the grayscale theme for accessibility

export const ThemeContext = createContext();

const ThemeProviderWrapper = ({ children }) => {
  const [themeMode, setThemeMode] = useState('default'); // "default" or "grayscale"

  const theme = useMemo(() => (themeMode === 'default' ? defaultTheme : grayscaleTheme), [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'default' ? 'grayscale' : 'default'));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
