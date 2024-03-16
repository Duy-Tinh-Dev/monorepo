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
  },
});

export default theme;
