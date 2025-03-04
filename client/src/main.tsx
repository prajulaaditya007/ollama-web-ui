import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme (customize colors, typography, etc.)
const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Provides a baseline CSS reset */}
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);