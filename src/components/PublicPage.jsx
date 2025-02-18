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
  Rating,
  Tooltip,
} from "@mui/material";
import { fetchProductTypes, fetchProducts } from "../api/products";
import { useNavigate } from "react-router-dom";
import ComparathorLogo from "../assets/app-logo.svg";

function PublicPage() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "score", descending: true });
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

  // Extract unique attributes dynamically
  const uniqueAttributes = new Set();
  products.forEach((product) => {
    product?.product_metadata?.forEach(({ attribute }) => {
      uniqueAttributes.add(attribute);
    });
  });

  // Sorting function based on selected column
  const sortedProducts = [...selectedProducts].map((productId) =>
    products.find((p) => p.id === productId)
  ).sort((a, b) => {
    const key = sortConfig.key;
    const valueA = key === "score" ? a.score : (a.product_metadata.find(meta => meta.attribute === key)?.score || 0);
    const valueB = key === "score" ? b.score : (b.product_metadata.find(meta => meta.attribute === key)?.score || 0);
    return sortConfig.descending ? valueB - valueA : valueA - valueB;
  });

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

        {/* 🚀 Login & Sign Up Buttons Moved Here */}
        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Box>
      </Box>

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
        <Table>
          {/* Table Head */}
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                Product
              </TableCell>
              {[...uniqueAttributes].map((attribute) => (
                <TableCell key={attribute} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                  {attribute}
                </TableCell>
              ))}
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                Price (€)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                Total Score
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                {/* Product Name */}
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>{product.name}</TableCell>

                {/* Attribute Values */}
                {[...uniqueAttributes].map((attribute) => {
                  const metadata = product.product_metadata.find(meta => meta.attribute === attribute);
                  const value = metadata ? metadata.value : "N/A";
                  const score = metadata ? parseFloat(metadata.score) : 0;
                  return (
                    <TableCell key={attribute} sx={{ textAlign: "center", verticalAlign: "middle" }}>
                      <Typography variant="body1" fontWeight="bold">{value}</Typography>
                      <Tooltip title={`Score: ${score}`}>
                        <Rating value={score} precision={0.1} readOnly />
                      </Tooltip>
                    </TableCell>
                  );
                })}

                {/* Price Row */}
                <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main" }}>
                  €{product.price ? product.price.toFixed(2) : "N/A"}
                </TableCell>

                {/* Total Score Row */}
                <TableCell sx={{ textAlign: "center" }}>
                  <Tooltip title={`Total Score: ${product.score}`}>
                    <Rating value={product.score} precision={0.1} readOnly />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
    </Container>
  );
}

export default PublicPage;
