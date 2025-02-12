import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Edit, Delete, Add, Info, TableChart, GridView } from "@mui/icons-material";
import {
  loadProducts,
  handleEditProduct,
  handleAddProduct,
  handleViewProduct,
  handleCloseModals,
  handleDeleteConfirmation,
  handleDeleteConfirmed,
  handleAttributeChange,
  handleUpdateChanges
} from "../utils/productHandlers";
import UpdateProductModal from "./modals/UpdateProductModal";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // Default to table view

  useEffect(() => {
    loadProducts(setProducts);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Title & View Toggle */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333", textTransform: "uppercase", letterSpacing: 1 }}>
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
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}></TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Brand</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Score</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image_base64}
                      alt={product.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{product.brand}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: 600, color: "#1976d2" }}>
                    {product.score}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => handleViewProduct(product, setSelectedProduct, setIsInfoModalOpen)}>
                        <Info />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="info" onClick={() => handleEditProduct(product, setSelectedProduct, setIsEditing, setIsModalOpen)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteConfirmation(product, setProductToDelete, setIsConfirmOpen)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
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
                  Score: {product.score}
                </Typography>
                <Box mt={2}>
                  <Tooltip title="View Details">
                    <IconButton color="primary" onClick={() => handleViewProduct(product, setSelectedProduct, setIsInfoModalOpen)}>
                      <Info />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="info" onClick={() => handleEditProduct(product, setSelectedProduct, setIsEditing, setIsModalOpen)}>
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

      {/* Add Product Button */}
      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleAddProduct(setSelectedProduct, setIsEditing, setIsModalOpen, setProductTypes)}>
          Add Product
        </Button>
      </Box>

      {/* Info Modal */}
      <Dialog open={isInfoModalOpen} onClose={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <img
                src={selectedProduct.image_base64}
                alt={selectedProduct.name}
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  border: "3px solid #ddd",
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{selectedProduct.name}</Typography>
              <Typography variant="subtitle1" sx={{ color: "#555" }}>Brand: {selectedProduct.brand}</Typography>
              <Typography variant="subtitle1" sx={{ color: "#555" }}>Score: {selectedProduct.score}</Typography>

              {selectedProduct.product_metadata.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>Attributes</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Attribute</b></TableCell>
                        <TableCell><b>Value</b></TableCell>
                        <TableCell><b>Score</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProduct.product_metadata.map((meta, index) => (
                        <TableRow key={index}>
                          <TableCell>{meta.attribute}</TableCell>
                          <TableCell>{meta.value}</TableCell>
                          <TableCell>{meta.score}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>No metadata available</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {productToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Product Modals */}
      <UpdateProductModal open={isModalOpen} onClose={() => handleCloseModals(setSelectedProduct, setIsModalOpen)} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} handleAttributeChange={handleAttributeChange} handleUpdateChanges={handleUpdateChanges} setIsModalOpen={setIsModalOpen} setProducts={setProducts} />
    </Container>
  );
}

export default MyProducts;
