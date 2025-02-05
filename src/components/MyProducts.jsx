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
} from "@mui/material";
import { Edit, Delete, Add, Info } from "@mui/icons-material";
import ProductModal from "./ProductModal";
import { fetchProducts, deleteProduct } from "../api/products";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

  // Manejar eliminación de productos
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Abrir modal de atributos
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Products
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Brand</b></TableCell>
              <TableCell><b>Score</b></TableCell>
              <TableCell align="center"><b>Details</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.score}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenModal(product)}>
                    <Info />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton edge="end" aria-label="edit" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      {/* Modal de detalles */}
      {selectedProduct && (
        <Dialog open={Boolean(selectedProduct)} onClose={handleCloseModal}>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6"><b>{selectedProduct.name}</b></Typography>
            <Typography variant="subtitle1">{selectedProduct.brand}</Typography>
            <Typography variant="subtitle1">Score: {selectedProduct.score}</Typography>
            {selectedProduct.product_metadata.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Attribute</b></TableCell>
                    <TableCell><b>Value</b></TableCell>
                    <TableCell><b>Score</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProduct.product_metadata.map((meta) => (
                    <TableRow key={meta.id}>
                      <TableCell>{meta.attribute}</TableCell>
                      <TableCell>{meta.value}</TableCell>
                      <TableCell>{meta.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2">No metadata available</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Product Modal for Adding New Products */}
      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={(newProduct) => setProducts([...products, newProduct])}
      />
    </Container>
  );
}

export default MyProducts;
