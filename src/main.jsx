import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles'; // Import MUI's ThemeProvider
import CssBaseline from '@mui/material/CssBaseline'; // Import MUI's CssBaseline for global reset
import theme from './themes/theme'; // Import your custom theme

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
