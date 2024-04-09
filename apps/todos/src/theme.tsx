import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc4c3e',
    },
    secondary: {
      main: '#666666',
      '100': '#fff',
    },
    info: {
      main: '#ccc',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontSize: '26px',
        },
        paragraph: {
          color: '#666666',
          marginBottom: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        scrollbarColor: 'rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.1)',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(155, 155, 155, 0.5)',
        },
      },
    },
  },
});

export default theme;
