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
  Card,
  CardContent,
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

  return (
    <Container maxWidth="lg">
      {/* Branding Section */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={3}
        py={3}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: 3,
          boxShadow: 1,
        }}
      >
        <img src={ComparathorLogo} alt="Comparathor Logo" style={{ width: 130, height: 130 }} />
        <Typography variant="h3" fontWeight="bold" color="primary">
          Comparathor
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" textAlign="center">
          Compare products easily and make informed decisions.
        </Typography>
      </Box>

      {/* Product Type Overview */}
      <Grid container spacing={3} mt={4}>
        {productTypes.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type.id}>
            <Card sx={{ transition: "0.3s", "&:hover": { boxShadow: 4 } }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {type.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {type.description}
                </Typography>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {Object.keys(type.metadata_schema || {}).map((attr) => (
                    <Chip key={attr} label={attr} variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Product Type Selector */}
      <Box mt={3}>
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
      </Box>

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
          <Table stickyHeader>
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
              {selectedProducts.map((productId) => (
                <TableRow key={productId} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell sx={{ fontWeight: "bold" }}>{products.find((p) => p.id === productId)?.name}</TableCell>
                  <TableCell>Details Here</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Call to Action for Login or Sign Up */}
      <Box mt={4} display="flex" justifyContent="center">
        <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 2, textAlign: "center", width: 300 }}>
          <Typography variant="h6" fontWeight="bold">
            Join to Save Your Comparisons!
          </Typography>
          <Box mt={2} display="flex" gap={2} justifyContent="center">
            <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default PublicPage;
