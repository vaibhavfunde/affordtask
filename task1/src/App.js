import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import StockPage from './components/StockPage';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import Navigation from './components/Navigation';
import AppInitializer from './components/AppInitializer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = React.useState('stocks');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppInitializer>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            {currentPage === 'stocks' ? <StockPage /> : <CorrelationHeatmap />}
          </Container>
        </Box>
      </AppInitializer>
    </ThemeProvider>
  );
}

export default App; 