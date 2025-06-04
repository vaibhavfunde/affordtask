import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getAuthHeaders } from '../services/authService';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Use relative URL for proxy
const API_BASE_URL = '/evaluation-service';

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [timeInterval, setTimeInterval] = useState('1D');
  const [stockData, setStockData] = useState(null);
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
        if (response.data.length > 0) {
          setSelectedStock(response.data[0]);
        }
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
    const fetchStockData = async () => {
      if (!selectedStock) return;

      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const response = await axios.get(
          `${API_BASE_URL}/stocks/${selectedStock}/prices?timeInterval=${timeInterval}`,
          { headers }
        );
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedStock, timeInterval]);

  const chartData = {
    labels: stockData?.prices?.map(price => new Date(price.timestamp).toLocaleTimeString()) || [],
    datasets: [
      {
        label: `${selectedStock} Price`,
        data: stockData?.prices?.map(price => price.price) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedStock} Price Chart`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Stock Price Chart
            </Typography>
            {warning && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {warning}
              </Alert>
            )}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Stock</InputLabel>
                  <Select
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                    label="Select Stock"
                  >
                    {stocks.map((stock) => (
                      <MenuItem key={stock} value={stock}>
                        {stock}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Interval</InputLabel>
                  <Select
                    value={timeInterval}
                    onChange={(e) => setTimeInterval(e.target.value)}
                    label="Time Interval"
                  >
                    <MenuItem value="1D">1 Day</MenuItem>
                    <MenuItem value="1W">1 Week</MenuItem>
                    <MenuItem value="1M">1 Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
              </div>
            ) : (
              stockData && <Line data={chartData} options={chartOptions} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StockPage; 