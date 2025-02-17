import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  TextField,
  Button,
  Chip,
  Grid,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { fetchProductTypes, fetchProducts } from "../api/products";
import { useNavigate } from "react-router-dom";
import ComparathorLogo from "../assets/app-logo.svg";

function PublicPage() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const navigate = useNavigate();

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

  const handleTypeChange = async (event) => {
    const selectedTypeId = event.target.value;
    setSelectedProductType(selectedTypeId);
    setSelectedProducts([]); // Reset selection
    setShowComparison(false);

    try {
      const allProducts = await fetchProducts();
      const filteredProducts = allProducts.filter(
        (product) => product.product_type_id === selectedTypeId
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductSelection = (event) => {
    setSelectedProducts(event.target.value);
  };

  const handleCompare = () => {
    if (selectedProducts.length > 0) {
      setShowComparison(true);
    }
  };

  // Extract unique attributes from selected products
  const uniqueAttributes = new Set();
  selectedProducts.forEach((productId) => {
    const product = products.find((p) => p.id === productId);
    product?.product_metadata?.forEach((meta) => uniqueAttributes.add(meta.attribute));
  });

  // Determine the best value for each attribute
  const bestValues = {};
  [...uniqueAttributes].forEach((attribute) => {
    bestValues[attribute] = Math.max(
      ...selectedProducts.map((productId) => {
        const product = products.find((p) => p.id === productId);
        const metadata = product?.product_metadata?.find((meta) => meta.attribute === attribute);
        return metadata ? parseFloat(metadata.score) : -Infinity;
      })
    );
  });

  return (
    <Container maxWidth="lg">
      {/* Branding Section */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <img src={ComparathorLogo} alt="Comparathor Logo" style={{ width: 150, height: 150 }} />
        <Typography variant="h3" fontWeight="bold" color="primary">
          Comparathor
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" textAlign="center">
          Compare products easily and make informed decisions.
        </Typography>
      </Box>

      {/* Product Type Overview */}
      <Paper sx={{ padding: 3, marginBottom: 3, mt: 4, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          Available Product Types
        </Typography>
        <Grid container spacing={2}>
          {productTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6">{type.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {type.description}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {Object.keys(type.metadata_schema || {}).map((attr) => (
                    <Chip key={attr} label={attr} variant="outlined" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Product Type Selector */}
      <TextField
        select
        label="Product Type"
        fullWidth
        margin="dense"
        value={selectedProductType || ""}
        onChange={handleTypeChange}
      >
        <MenuItem value="" disabled>
          Select a Product Type
        </MenuItem>
        {productTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Product Selection */}
      {selectedProductType && (
        <TextField
          select
          label="Select Products"
          fullWidth
          margin="dense"
          multiple
          value={selectedProducts}
          onChange={handleProductSelection}
          SelectProps={{
            multiple: true,
            renderValue: (selected) =>
              selected.map((id) => products.find((p) => p.id === id)?.name).join(", "),
          }}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <Checkbox checked={selectedProducts.includes(product.id)} />
              <ListItemText primary={product.name} />
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Compare Button */}
      {selectedProducts.length > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleCompare}>
            Compare Products
          </Button>
        </Box>
      )}

      {/* Comparison Table */}
      {showComparison && (
        <TableContainer component={Paper} sx={{ boxShadow: 2, marginTop: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Attribute</TableCell>
                {selectedProducts.map((productId) => (
                  <TableCell key={productId} sx={{ color: "white", fontWeight: "bold" }}>
                    {products.find((p) => p.id === productId)?.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...uniqueAttributes].map((attribute) => (
                <TableRow key={attribute}>
                  <TableCell sx={{ fontWeight: "bold" }}>{attribute}</TableCell>
                  {selectedProducts.map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    const metadata = product?.product_metadata?.find((meta) => meta.attribute === attribute);
                    const isBest = metadata && parseFloat(metadata.score) === bestValues[attribute];

                    return (
                      <TableCell
                        key={productId}
                        sx={{
                          backgroundColor: isBest ? "#d4edda" : "inherit",
                          fontWeight: isBest ? "bold" : "normal",
                          textAlign: "center",
                        }}
                      >
                        {metadata?.value || "N/A"} (Score: {metadata?.score || "N/A"})
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Call to Action for Login or Sign Up */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}

export default PublicPage;
