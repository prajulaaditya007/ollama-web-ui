import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a premium, custom dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007aff', // macOS Apple Blue
      light: '#47a1ff',
      dark: '#005ec3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#27c93f', // macOS Emerald Green / Active status
      light: '#30e24b',
      dark: '#1e9b2f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#161616', // macOS native matte gray default sheet
      paper: '#202022', // macOS native sidebar/card graphite sheet
    },
    text: {
      primary: '#f3f4f6', // Sharp white
      secondary: '#a0a0a2', // Matte gray text
      disabled: '#555557',
    },
    divider: 'rgba(255, 255, 255, 0.05)',
  },
  typography: {
    fontFamily: '"-apple-system", "BlinkMacSystemFont", "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Inter", sans-serif',
    fontSize: 13, // macOS native compact desktop font size
    body1: {
      fontSize: '0.88rem', // ~12.5px - 13px
      lineHeight: 1.45,
    },
    body2: {
      fontSize: '0.8rem', // ~11.5px
      lineHeight: 1.4,
    },
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.92rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.88rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8rem', fontWeight: 500 },
    button: {
      fontSize: '0.82rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8, // macOS sharp rounded sheet corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
          background-color: #161616;
        }
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.24);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px', // macOS native standard sharper button
          padding: '6px 12px',
          fontSize: '0.82rem',
          transition: 'all 0.15s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            opacity: 0.95,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease-in-out',
          borderRadius: '6px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.06)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007aff', // Apple native blue focus border
            borderWidth: '1.5px',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);