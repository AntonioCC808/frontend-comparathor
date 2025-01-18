import React from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

function AddComparison() {
  const [productType, setProductType] = React.useState('');

  const handleTypeChange = (event) => {
    setProductType(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Add New Comparison
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Comparison Name"
          variant="outlined"
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="product-type-label">Product Type</InputLabel>
          <Select
            labelId="product-type-label"
            value={productType}
            onChange={handleTypeChange}
          >
            <MenuItem value="TV">TV</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Smartphone">Smartphone</MenuItem>
          </Select>
        </FormControl>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" size="large">
            Add Comparison
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddComparison;
