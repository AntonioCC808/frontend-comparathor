import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import {
  handleAttributeChange,
  handleUpdateChanges,
  handleImageUpload,
  handleDrop,
} from "../../utils/productHandlers";

const UpdateProductModal = ({ open, onClose, product, setProducts, isEditing }) => {
  const [selectedProduct, setSelectedProduct] = useState(product || null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isEditing) { 
      setSelectedProduct({
        name: "",
        brand: "",
        score: "",
        price: "", // ✅ Added price field
        image_base64: "",
        product_type: "",
        product_metadata: [],
      });
    } else if (product) {
      setSelectedProduct(product);
    }
  }, [product, isEditing]);

  const handleSubmit = async () => {
    if (isEditing) {
      await handleUpdateChanges(selectedProduct, setSelectedProduct, onClose, setProducts);
      setSuccessMessage("✅ Product updated successfully!");
    } else {
      await addProduct(selectedProduct);
      setSuccessMessage("✅ Product added successfully!");
      setSelectedProduct({
        name: "",
        brand: "",
        score: "",
        price: "",
        image_base64: "",
        product_type: "",
        product_metadata: [],
      });
    }
  };

  // ✅ Score Validation (0-5)
  const handleScoreChange = (e) => {
    let value = parseFloat(e.target.value);
    if (value < 0) value = 0;
    if (value > 5) value = 5;
    setSelectedProduct((prev) => ({ ...prev, score: value }));
  };

  // ✅ Price Validation (no negative values)
  const handlePriceChange = (e) => {
    let value = parseFloat(e.target.value);
    if (value < 0) value = 0;
    setSelectedProduct((prev) => ({ ...prev, price: value }));
  };

  if (!selectedProduct) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Update Product" : "Add Product"}</DialogTitle>
        <DialogContent>
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

          {/* ✅ Price Field in Euros (€) */}
          <TextField
            label="Price (€)"
            fullWidth
            margin="dense"
            type="number"
            value={selectedProduct.price || ""}
            onChange={handlePriceChange}
          />

          {/* ✅ Overall Score (0-5) */}
          <TextField
            label="Overall Score (0-5)"
            fullWidth
            margin="dense"
            type="number"
            value={selectedProduct.score || ""}
            onChange={handleScoreChange}
          />

          {/* Image Upload */}
          <Box
            sx={{
              border: "2px dashed #1976d2",
              borderRadius: "8px",
              textAlign: "center",
              padding: "20px",
              marginTop: "20px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, setSelectedProduct)}
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {selectedProduct.image_base64 ? (
              <img
                src={selectedProduct.image_base64}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
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
                  handleImageUpload(e.target.files[0], setSelectedProduct);
                }
              }}
            />
          </Box>

          {/* Attributes & Scores */}
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
                        onChange={(e) =>
                          handleAttributeChange(index, "value", e.target.value, setSelectedProduct)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Score (0-5)"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={meta.score || ""}
                        onChange={(e) => {
                          let value = parseFloat(e.target.value);
                          if (value < 0) value = 0;
                          if (value > 5) value = 5;
                          handleAttributeChange(index, "score", value, setSelectedProduct);
                        }}
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
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateProductModal;
