import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

const UpdateProductModal = ({
  open,
  onClose,
  selectedProduct,
  setSelectedProduct,
  handleAttributeChange,
  handleUpdateChanges,
  setIsModalOpen,
  setProducts
}) => {
  if (!selectedProduct) return null; // Prevents rendering empty modal

  // Handle Image Upload (Drag & Drop or File Input)
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedProduct({ ...selectedProduct, image_base64: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      handleImageUpload(event.dataTransfer.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        {/* Product Type Selector */}
  

        {/* Product Details */}
        <TextField
          label="Product Name"
          fullWidth
          margin="dense"
          value={selectedProduct.name || ""}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, name: e.target.value })
          }
        />
        <TextField
          label="Brand"
          fullWidth
          margin="dense"
          value={selectedProduct.brand || ""}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, brand: e.target.value })
          }
        />
        <TextField
          label="Score"
          fullWidth
          margin="dense"
          type="number"
          value={selectedProduct.score || ""}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, score: e.target.value })
          }
        />

        {/* Image Upload - Drag & Drop or File Selection */}
        <Box
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: "8px",
            textAlign: "center",
            padding: "20px",
            marginTop: "20px",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            "&:hover": { backgroundColor: "#f1f1f1" },
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("imageUpload").click()}
        >
          {selectedProduct.image_base64 ? (
            <img
              src={selectedProduct.image_base64}
              alt="Uploaded"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Drag & Drop an image here or click to upload
            </Typography>
          )}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
        </Box>

        {/* Attributes Section */}
        {selectedProduct.product_metadata?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
              Attributes
            </Typography>
            {selectedProduct.product_metadata.map((meta, index) => (
              <TextField
                key={index}
                label={meta.attribute}
                fullWidth
                margin="dense"
                type={meta.type === "number" ? "number" : "text"}
                value={meta.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
              />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleUpdateChanges(selectedProduct, setSelectedProduct, setIsModalOpen, setProducts)} color="primary">
        Update product
      </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductModal;
