import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import {
  handleTypeChange,
  handleAttributeChange,
  handleImageUpload,
  handleDrop,
  handleSubmit,
} from "../../utils/productHandlers";

import { fetchProductTypes } from "../../api/products";

const NewProductModal = ({ open, onClose, setProducts }) => {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    brand: "",
    score: "",
    image_base64: "",
    product_type: "",
    product_metadata: [],
  });

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        {/* Product Type Selector */}
        <TextField
          select
          label="Product Type"
          fullWidth
          margin="dense"
          value={selectedProduct.product_type || ""}
          onChange={(e) => handleTypeChange(e, productTypes, setSelectedProduct, selectedProduct)}
        >
          <MenuItem value="" disabled>
            Select a product type
          </MenuItem>
          {productTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Product Details */}
        <TextField
          label="Product Name"
          fullWidth
          margin="dense"
          value={selectedProduct.name || ""}
          onChange={(e) =>
            setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          label="Brand"
          fullWidth
          margin="dense"
          value={selectedProduct.brand || ""}
          onChange={(e) =>
            setSelectedProduct((prev) => ({ ...prev, brand: e.target.value }))
          }
        />
        <TextField
          label="Overall Score"
          fullWidth
          margin="dense"
          type="number"
          value={selectedProduct.score || ""}
          onChange={(e) =>
            setSelectedProduct((prev) => ({ ...prev, score: e.target.value }))
          }
        />

        {/* Image Upload Section */}
        <Box
          sx={{
            width: "100%",
            height: 150,
            border: "2px dashed #aaa",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, setSelectedProduct)}
          onClick={() => document.getElementById("imageUpload").click()}
        >
          {!selectedProduct.image_base64 && (
            <>
              <CloudUpload sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Drag & drop or click to upload image
              </Typography>
            </>
          )}

          {selectedProduct.image_base64 && (
            <img
              src={selectedProduct.image_base64}
              alt="Uploaded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}
        </Box>

        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setSelectedProduct)}
          style={{ display: "none" }}
        />

        {/* Attributes Section with Scores */}
        {selectedProduct.product_metadata?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
              Attributes
            </Typography>
            <Grid container spacing={2}>
              {selectedProduct.product_metadata.map((meta, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      label={meta.attribute}
                      fullWidth
                      margin="dense"
                      type={meta.type === "number" ? "number" : "text"}
                      value={meta.value}
                      onChange={(e) => handleAttributeChange(index, "value", e.target.value, setSelectedProduct)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Score"
                      fullWidth
                      margin="dense"
                      type="number"
                      value={meta.score || ""}
                      onChange={(e) => handleAttributeChange(index, "score", e.target.value, setSelectedProduct)}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={(e) =>
            handleSubmit(e, selectedProduct, setSelectedProduct, () => {}, () => {}, setProducts)
          }
          color="primary"
        >
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProductModal;
