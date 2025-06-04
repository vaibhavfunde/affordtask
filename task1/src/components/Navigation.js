import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HeatPumpIcon from '@mui/icons-material/HeatPump';

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Stock Price Aggregator
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<ShowChartIcon />}
            onClick={() => setCurrentPage('stocks')}
            sx={{
              backgroundColor: currentPage === 'stocks' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Stock Prices
          </Button>
          <Button
            color="inherit"
            startIcon={<HeatPumpIcon />}
            onClick={() => setCurrentPage('correlation')}
            sx={{
              backgroundColor: currentPage === 'correlation' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Correlation Heatmap
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 