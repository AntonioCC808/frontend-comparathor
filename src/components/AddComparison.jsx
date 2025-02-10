import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { fetchProductTypes, fetchProducts } from "../api/products";
import { addComparison } from "../api/comparisons";

function AddComparison() {
  const [comparisonName, setComparisonName] = useState("");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]); // Products of selected type
  const [selectedProducts, setSelectedProducts] = useState([]); // Selected products for comparison
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        setLoading(true);
        const types = await fetchProductTypes();
        setProductTypes(types);
      } catch (error) {
        setError("Failed to load product types. Try again.");
        console.error("Error fetching product types:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProductTypes();
  }, []);

  // Handle change in product type selection
  const handleTypeChange = async (event) => {
    const selectedTypeId = event.target.value;
    setProductType(selectedTypeId);
    setSelectedProducts([]); // Reset selected products when type changes

    try {
      setLoading(true);
      const allProducts = await fetchProducts();
      const filteredProducts = allProducts.filter(
        (product) => product.id_product_type === selectedTypeId
      );
      setProducts(filteredProducts);
    } catch (error) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting multiple products
  const handleProductSelection = (event) => {
    setSelectedProducts(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!comparisonName || !productType || !description || selectedProducts.length === 0) {
      setError("All fields are required, and you must select at least one product.");
      return;
    }
  
    const today = new Date().toISOString().split("T")[0]; // ✅ Extracts only YYYY-MM-DD
  
    const comparisonData = {
      title: comparisonName,
      description,
      id_user: localStorage.getItem("user_id"),
      product_type: productType,
      date_created: today, // ✅ Now only stores YYYY-MM-DD
      products: selectedProducts.map((id) => id),
    };
  
    try {
      console.log("📤 Sending comparison data:", comparisonData);
      await addComparison(comparisonData);
      setSuccessMessage("✅ Comparison added successfully!");
    
      // Auto-hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error submitting comparison:", error);
      setError("Failed to add comparison. Please try again.");
    }
    
  };
  
  

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mt: 3 }}
      >
        Add New Comparison
      </Typography>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 3,
          maxWidth: 500,
          margin: "auto",
        }}
      >
        {/* Product Type Selector */}
        <TextField
          select
          label="Product Type"
          fullWidth
          margin="dense"
          value={productType}
          onChange={handleTypeChange}
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Select a product type
          </MenuItem>
          {productTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Comparison Name */}
        <TextField
          label="Comparison Name"
          fullWidth
          margin="dense"
          value={comparisonName}
          onChange={(e) => setComparisonName(e.target.value)}
        />

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Loading Indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {/* Product Selection */}
        {!loading && productType && products.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-selection-label">Select Products</InputLabel>
            <Select
              labelId="product-selection-label"
              multiple
              value={selectedProducts}
              onChange={handleProductSelection}
              renderValue={(selected) =>
                selected
                  .map((id) => products.find((p) => p.id === id)?.name)
                  .join(", ")
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  <Checkbox checked={selectedProducts.includes(product.id)} />
                  <ListItemText primary={product.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* No Products Available Message */}
        {productType && !loading && products.length === 0 && (
          <Typography variant="body1" color="textSecondary" align="center">
            No products available for this type.
          </Typography>
        )}

        {/* Submit Button */}
        <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ fontSize: "16px", padding: "10px 20px", borderRadius: "8px" }}
        onClick={handleSubmit} // <-- Ensure this calls handleSubmit
      >
        ADD COMPARISON
      </Button>

      </Box>
    </Container>
  );
}

export default AddComparison;
