import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { createProduct } from "../api/products";

function ProductModal({ open, onClose, onProductAdded }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [score, setScore] = useState("");

  const handleSave = async () => {
    if (!name || !brand || !score) {
      alert("All fields are required.");
      return;
    }
    try {
      const newProduct = { name, brand, score: Number(score), id_user: 1 };
      const createdProduct = await createProduct(newProduct);
      onProductAdded(createdProduct);
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Brand"
          fullWidth
          margin="normal"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <TextField
          label="Score"
          type="number"
          fullWidth
          margin="normal"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductModal;
