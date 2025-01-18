import React from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

function MyProducts() {
  const products = ["Product 1", "Product 2"]; // Example product list

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Products
      </Typography>
      <List>
        {products.map((product, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" color="primary">
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" color="error">
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={product} />
          </ListItem>
        ))}
      </List>
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size="large"
        >
          Add Product
        </Button>
      </Box>
    </Container>
  );
}

export default MyProducts;
