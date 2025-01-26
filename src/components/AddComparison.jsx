import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { fetchProductTypes } from "../api/products";

function AddComparison() {
  const [comparisonName, setComparisonName] = useState("");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const types = await fetchProductTypes();
        setProductTypes(types);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };
    loadProductTypes();
  }, []);

  const handleTypeChange = (event) => {
    setProductType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comparisonName || !productType || !description) {
      alert("Please fill out all fields.");
      return;
    }

    // Add submission logic here
    console.log("Comparison Submitted:", {
      comparisonName,
      productType,
      description,
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Add New Comparison
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Comparison Name"
          variant="outlined"
          margin="normal"
          value={comparisonName}
          onChange={(e) => setComparisonName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="product-type-label">Product Type</InputLabel>
          <Select
            labelId="product-type-label"
            value={productType}
            onChange={handleTypeChange}
          >
            {productTypes.map((type) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" size="large" type="submit">
            Add Comparison
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddComparison;
