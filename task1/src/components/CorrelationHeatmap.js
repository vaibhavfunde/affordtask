import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { getAuthHeaders } from '../services/authService';
import axios from 'axios';

// Use relative URL for proxy
const API_BASE_URL = '/evaluation-service';

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState([]);
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setWarning(null);
        const headers = await getAuthHeaders();
        const response = await axios.get(`${API_BASE_URL}/stocks`, { headers });
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setWarning('Unable to fetch stocks at this time. The data shown may be outdated.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      if (stocks.length === 0) return;

      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const response = await axios.get(
          `${API_BASE_URL}/stocks/correlation`,
          { headers }
        );
        setCorrelationData(response.data);
      } catch (error) {
        console.error('Error fetching correlation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationData();
  }, [stocks]);

  const renderHeatmap = () => {
    if (!correlationData) return null;

    const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    };

    const cellStyle = (value) => ({
      padding: '8px',
      textAlign: 'center',
      backgroundColor: `rgba(75, 192, 192, ${Math.abs(value)})`,
      color: Math.abs(value) > 0.5 ? 'white' : 'black',
    });

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th></th>
            {stocks.map((stock) => (
              <th key={stock}>{stock}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock1) => (
            <tr key={stock1}>
              <th>{stock1}</th>
              {stocks.map((stock2) => (
                <td key={`${stock1}-${stock2}`} style={cellStyle(correlationData[stock1][stock2])}>
                  {correlationData[stock1][stock2].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Stock Correlation Heatmap
            </Typography>
            {warning && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {warning}
              </Alert>
            )}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
              </div>
            ) : (
              renderHeatmap()
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CorrelationHeatmap; 