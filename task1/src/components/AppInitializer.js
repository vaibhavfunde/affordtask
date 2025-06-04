import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { register } from '../services/authService';

const AppInitializer = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
       // await register();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Initializing application...</Typography>
      </Box>
    );
  }

  return children;
};

export default AppInitializer; 