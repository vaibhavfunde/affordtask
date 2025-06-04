import React, { useEffect, useState } from 'react';
import HeatMapGrid from 'react-heatmap-grid';
import {
  Paper,
  Typography,
  Container,
  CircularProgress,
  Tooltip,
  Box,
} from '@mui/material';
import axios from 'axios';
import { getAuthHeaders } from '../services/authService';

const API_BASE_URL = '/evaluation-service';

// Utility functions
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
const stddev = (arr, m = mean(arr)) =>
  Math.sqrt(arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / (arr.length || 1));

const pearsonCorrelation = (x, y) => {
  const mx = mean(x);
  const my = mean(y);
  const cov = x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0);
  const stdX = stddev(x, mx);
  const stdY = stddev(y, my);
  return stdX && stdY ? cov / (x.length * stdX * stdY) : 0;
};

const CorrelationHeatmap = ({ intervalMinutes = 10 }) => {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState({});
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      setLoading(true);
      try {
        const headers = await getAuthHeaders();
        const response = await axios.get(
          `${API_BASE_URL}/stocks`,
          { headers }
        );
        const stockList = response.data || [];
        setStocks(stockList);

        const stockPrices = {};
        for (const stock of stockList) {
          const res = await axios.get(
            `${API_BASE_URL}/stocks/${stock}/prices?timeInterval=${intervalMinutes}M`,
            { headers }
          );
          stockPrices[stock] = res.data.prices.map((p) => p.price);
        }

        setStockData(stockPrices);
      } catch (err) {
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, [intervalMinutes]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (stocks.length === 0 || Object.keys(stockData).length === 0) {
    return <Typography variant="body1">No data available</Typography>;
  }

  // Prepare heatmap data
  const data = stocks.map((stockX) =>
    stocks.map((stockY) => {
      const x = stockData[stockX] || [];
      const y = stockData[stockY] || [];
      return pearsonCorrelation(x, y).toFixed(2);
    })
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Stock Correlation Heatmap (Last {intervalMinutes} minutes)
        </Typography>
        <HeatMapGrid
          xLabels={stocks}
          yLabels={stocks}
          data={data}
          cellStyle={(background, value, min, max, data, x, y) => {
            const v = parseFloat(value);
            let bgColor = '#fff';
            if (v > 0.75) bgColor = '#1a9850';
            else if (v > 0.5) bgColor = '#66bd63';
            else if (v > 0.25) bgColor = '#a6d96a';
            else if (v > 0) bgColor = '#d9ef8b';
            else if (v === 0) bgColor = '#ffffbf';
            else if (v > -0.25) bgColor = '#fee08b';
            else if (v > -0.5) bgColor = '#fdae61';
            else if (v > -0.75) bgColor = '#f46d43';
            else bgColor = '#d73027';
            return {
              background: bgColor,
              fontSize: '14px',
              color: '#000',
              textAlign: 'center',
              padding: '10px',
            };
          }}
          cellRender={(x, y, value) => (
            <Tooltip
              title={
                <>
                  <div><b>{stocks[y]}</b> vs <b>{stocks[x]}</b></div>
                  <div>Correlation: <b>{value}</b></div>
                  <div>Avg: {mean(stockData[stocks[y]]).toFixed(2)}</div>
                  <div>Std Dev: {stddev(stockData[stocks[y]]).toFixed(2)}</div>
                </>
              }
              arrow
              placement="top"
            >
              <span>{value}</span>
            </Tooltip>
          )}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Green = strong positive correlation, Red = strong negative correlation, Yellow = neutral.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CorrelationHeatmap;
