import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
    typography: {
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif', // Specify Lato as the primary font
        h1: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 700, // Bold weight for headings
          fontSize: '2.5rem', // Font size for h1
          lineHeight: 1.2, // Line height for h1
        },
        h2: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 700,
          fontSize: '2rem', // Font size for h2
          lineHeight: 1.3,
        },
        h3: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600, // Semi-bold weight for h3
          fontSize: '1.75rem', // Font size for h3
          lineHeight: 1.4,
        },
        h4: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600,
          fontSize: '1.5rem', // Font size for h4
          lineHeight: 1.5,
        },
        h5: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 500, // Medium weight for h5
          fontSize: '1.25rem', // Font size for h5
          lineHeight: 1.6,
        },
        h6: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          fontSize: '1rem', // Font size for h6
          lineHeight: 1.6,
        },
        body1: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 400, // Regular weight for body text
          fontSize: '1rem', // Font size for body1
          lineHeight: 1.5,
        },
        body2: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 400,
          fontSize: '0.875rem', // Font size for body2
          lineHeight: 1.4,
        },
        button: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600, // Semi-bold weight for buttons
          fontSize: '0.95rem' // Font size for buttons
        },
    },
    palette: {
        primary: {
          main: '#124662', 
          light: '#4e84a6', 
          dark: '#02324C', 
          contrastText: '#FDFAFA', 
        },
        secondary: {
          main: '#90080D', 
          light: '#A8101A', 
          dark: '#780000', 
          contrastText: '#FDFAFA', 
        },
        info: {
          main: '#B2CAE2',
          contrastText: '#FDFAFA', 
        },
        background: {
          default: '#EEEEEE', // Light Grey
          paper: '#FDFAFA', // White for paper components
        },
        text: {
          primary: '#0E1A2F', // Dark Grey for primary text
          secondary: '#1C345E', // Medium Grey for secondary text
        },
      },
});

const grayscaleTheme = createTheme({
    typography: {
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif', // Specify Lato as the primary font
        h1: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 700, // Bold weight for headings
          fontSize: '2.5rem', // Font size for h1
          lineHeight: 1.2, // Line height for h1
        },
        h2: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 700,
          fontSize: '2rem', // Font size for h2
          lineHeight: 1.3,
        },
        h3: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600, // Semi-bold weight for h3
          fontSize: '1.75rem', // Font size for h3
          lineHeight: 1.4,
        },
        h4: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600,
          fontSize: '1.5rem', // Font size for h4
          lineHeight: 1.5,
        },
        h5: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 500, // Medium weight for h5
          fontSize: '1.25rem', // Font size for h5
          lineHeight: 1.6,
        },
        h6: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 500,
          fontSize: '1rem', // Font size for h6
          lineHeight: 1.6,
        },
        body1: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 400, // Regular weight for body text
          fontSize: '1rem', // Font size for body1
          lineHeight: 1.5,
        },
        body2: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 400,
          fontSize: '0.875rem', // Font size for body2
          lineHeight: 1.4,
        },
        button: {
          fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
          fontWeight: 600, // Semi-bold weight for buttons
          fontSize: '0.875rem' // Font size for buttons
        },
    },
    palette: {
      primary: {
        main: '#7D7D7D', // Gray for primary actions
        light: '#A9A9A9', // Light gray variant
        dark: '#4B4B4B', // Dark gray variant
        contrastText: '#FFFFFF', // White text on primary
      },
      secondary: {
        main: '#B0B0B0', // Light gray for secondary actions
        light: '#D3D3D3', // Lighter gray variant
        dark: '#808080', // Darker gray variant
        contrastText: '#000000', // Black text on secondary
      },
      info: {
        main: '#A0A0A0', // Gray for informational messages
        contrastText: '#FFFFFF', // White text on info
      },
      background: {
        default: '#F5F5F5', // Light gray background
        paper: '#FFFFFF', // White for paper components
      },
      text: {
        primary: '#212121', // Dark gray for primary text
        secondary: '#757575', // Medium gray for secondary text
      },
    },
  });

export { defaultTheme, grayscaleTheme };