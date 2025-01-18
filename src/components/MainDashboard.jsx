import React from 'react';
import { Box, Button, Typography, Container, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainDashboard() {
  const navigate = useNavigate();

  return (
      <Container maxWidth="md">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to Comparathor
          </Typography>
        </Box>
        <Grid2 container spacing={4}>
          <Grid2 item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/products')}
            >
              My Products
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/comparisons')}
            >
              My Comparisons
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/addProduct')}
            >
              Add New Product
            </Button>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/addComparison')}
            >
              Add New Comparison
            </Button>
          </Grid2>
        </Grid2>
        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/config')}
          >
            Configuration
          </Button>
        </Box>
      </Container>
  );
}

export default MainDashboard;
