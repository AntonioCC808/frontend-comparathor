import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import ProductModal from "./ProductModal";
import { fetchProducts, deleteProduct } from "../api/products";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products on component load
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

  // Handle adding a new product
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  // Handle deleting a product
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Products
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <>
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
              </>
            }
          >
            <ListItemText primary={product.name} />
          </ListItem>
        ))}
      </List>
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
      {/* Add ProductModal */}
      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleAddProduct}
      />
    </Container>
  );
}

export default MyProducts;
