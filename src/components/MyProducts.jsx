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
  TextField,
} from "@mui/material";
import { Edit, Delete, Add, Info } from "@mui/icons-material";
import {
  loadProducts,
  handleEditProduct,
  handleAddProduct,
  handleViewProduct,
  handleCloseModals,
  handleDeleteConfirmation,
  handleDeleteConfirmed,
  handleSaveChanges,
  handleAttributeChange,
} from "../utils/productHandlers";
import ProductModal from "./ProductModal";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    loadProducts(setProducts);
  }, []);

  return (
    <Container maxWidth="md">
      {/* Title */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mt: 3 }}
      >
        My Products
      </Typography>

      {/* Product Table */}
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
          "& tbody tr:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9", // Zebra striping (Odd rows)
          },
          "& tbody tr:nth-of-type(even)": {
            backgroundColor: "white", // Zebra striping (Even rows)
          },
          "& tbody tr:hover": {
            backgroundColor: "#e3f2fd", // Soft blue on hover
            transition: "background 0.3s ease",
          },
        }}
      >
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
                    src={product.image_url || "https://picsum.photos/50"}
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{product.brand}</TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
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

      {/* Add Product Button */}
      <Box textAlign="right" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
          }}
          onClick={() => handleAddProduct(setSelectedProduct, setIsEditing, setIsModalOpen, setProductTypes)}
        >
          Add Product
        </Button>
      </Box>

      {/* Add Product Modal */}
      <ProductModal
        open={isModalOpen}
        onClose={() => handleCloseModals(setSelectedProduct, setIsModalOpen)}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        productTypes={productTypes}
        handleAttributeChange={handleAttributeChange}
        handleSaveChanges={handleSaveChanges}
      />

      {/* Info Modal */}
      <Dialog open={isInfoModalOpen} onClose={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <img
                src={selectedProduct.image_url || "https://picsum.photos/150"}
                alt={selectedProduct.name}
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{selectedProduct.name}</Typography>
              <Typography variant="subtitle1">Brand: {selectedProduct.brand}</Typography>
              <Typography variant="subtitle1">Score: {selectedProduct.score}</Typography>

              {selectedProduct.product_metadata.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>Attributes</Typography>
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
                <Typography variant="body2">No metadata available</Typography>
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
    </Container>
  );
}

export default MyProducts;
