import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Container,
  Tooltip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Rating
} from "@mui/material";
import { Edit, Delete, Add, Info, TableChart, GridView,   ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
  loadProducts,
  handleEditProduct,
  handleAddProduct,
  handleViewProduct,
  handleCloseModals,
  handleDeleteConfirmation,
  handleDeleteConfirmed,
} from "../utils/productHandlers";
import UpdateProductModal from "./modals/UpdateProductModal";
import NewProductModal from "./modals/NewProductModal";
import InfoProductModal from "./modals/InfoProductModal";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


const fetchProductTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product-types`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product types:", error);
    return [];
  }
};

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [nameFilter, setNameFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending


  useEffect(() => {
    loadProducts(setProducts);
    fetchProductTypes().then(setProductTypes);
  }, []);

  // Map products to include product_type_name
const mappedProducts = products.map(product => ({
  ...product,
  product_type_name: productTypes.find(pt => pt.id === product.product_type_id)?.name || "Unknown"
}));

// Filtering logic
const filteredProducts = mappedProducts.filter((product) =>
  product.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
  product.brand.toLowerCase().includes(brandFilter.toLowerCase()) &&
  (product.product_type_name || "").toLowerCase().includes(typeFilter.toLowerCase())
);

// Sorting logic (ensure filteredProducts exists first)
const sortedProducts = [...filteredProducts].sort((a, b) =>
  sortOrder === "asc" ? a.score - b.score : b.score - a.score
);


const toggleSortOrder = () => {
  setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
};


  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Title, Search & View Toggle */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333" }}>
          My Products
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newView) => newView && setViewMode(newView)}
          sx={{ backgroundColor: "#f1f1f1", borderRadius: "10px", p: 0.5 }}
        >
          <ToggleButton value="table" sx={{ borderRadius: "10px", px: 3 }}>
            <TableChart sx={{ mr: 1 }} /> Table
          </ToggleButton>
          <ToggleButton value="grid" sx={{ borderRadius: "10px", px: 3 }}>
            <GridView sx={{ mr: 1 }} /> Grid
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, overflow: "hidden" }}>
          <Table>
            {/* Table Header */}
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}></TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Brand</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  Score
                  <IconButton onClick={toggleSortOrder} sx={{ color: "white", p: 0, width: 24, height: 24 }}>
                    {sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                  </IconButton>
                </Box>
              </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
              {/* Filters Row */}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <TextField fullWidth placeholder="Search Name..." variant="outlined" size="small" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth placeholder="Search Brand..." variant="outlined" size="small" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth placeholder="Search Type..." variant="outlined" size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.image_base64} alt={product.name} style={{ width: "50px", height: "50px", borderRadius: "10px", objectFit: "cover", border: "2px solid #ddd" }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{product.brand}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{product.product_type_name}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    <Rating value={product.score} precision={0.1} readOnly />
                  </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton color="primary" onClick={() => handleViewProduct(product, setSelectedProduct, setIsInfoModalOpen)}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton color="info" onClick={() => handleEditProduct(product, setSelectedProduct, setIsEditing, setIsEditModalOpen)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteConfirmation(product, setProductToDelete, setIsConfirmOpen)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="textSecondary">No products found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

            {/* GRID VIEW */}
            {viewMode === "grid" && (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <img
                  src={product.image_base64}
                  alt={product.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>{product.name}</Typography>
                <Typography variant="body1" color="textSecondary">Brand: {product.brand}</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, color: "#1976d2" }}>
                    <Rating value={product.score} precision={0.1} readOnly />
                </Typography>
                <Box mt={2}>
                <Tooltip title="View Details">
                    <IconButton color="primary" onClick={() => handleViewProduct(product, setSelectedProduct, setIsInfoModalOpen)}>
                      <Info />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="info" onClick={() => handleEditProduct(product, setSelectedProduct, setIsEditing, setIsEditModalOpen)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteConfirmation(product, setProductToDelete, setIsConfirmOpen)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Update Product Modal */}
      <UpdateProductModal
        open={isEditModalOpen} // ✅ Only opens when editing an existing product
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        setProducts={setProducts}
        isEditing={isEditing}
      />

      {/* Info Modal */}
      <InfoProductModal
        open={isInfoModalOpen}
        onClose={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {productToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => handleDeleteConfirmed(productToDelete, products, setProducts, setIsConfirmOpen, setProductToDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyProducts;
