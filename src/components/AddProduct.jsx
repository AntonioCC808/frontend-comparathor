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
import { fetchProductTypes, createProduct } from "../api/products";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product types on component mount
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

    if (!productName || !productType) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: productName,
        product_type: productType,
        id_user: 1, // Replace with the actual user ID if available
      };
      const response = await createProduct(payload);
      alert("Product added successfully!");
      console.log("Product added:", response);

      // Reset form
      setProductName("");
      setProductType("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Add New Product
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Product Name"
          variant="outlined"
          margin="normal"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="product-type-label">Product Type</InputLabel>
          <Select
            labelId="product-type-label"
            value={productType}
            onChange={handleTypeChange}
          >
            {productTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Product"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddProduct;
