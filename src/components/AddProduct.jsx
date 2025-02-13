import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { fetchProductTypes } from "../api/products";
import {
  handleSubmit,
  handleTypeChange,
  handleDrop,
  handleImageUpload,
  handleAttributeChange,
} from "../utils/productHandlers";

function AddProduct() {
  const [productTypes, setProductTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", mt: 3 }}>
        Add New Product
      </Typography>

      {/* Success & Error Messages */}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => handleSubmit(e, selectedProduct, setSelectedProduct, setErrorMessage, setSuccessMessage)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 3,
          maxWidth: 500,
          margin: "auto",
        }}
      >
        {/* Product Type Selector */}
        <TextField
          select
          label="Product Type"
          fullWidth
          margin="dense"
          value={selectedProduct.product_type || ""}
          onChange={(e) => handleTypeChange(e, productTypes, setSelectedProduct, selectedProduct)}
        >
          <MenuItem value=""></MenuItem>
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
          value={selectedProduct.name}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
        />
        <TextField
          label="Brand"
          fullWidth
          margin="dense"
          value={selectedProduct.brand}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
        />
        <TextField
          label="Overall Score"
          fullWidth
          margin="dense"
          type="number"
          value={selectedProduct.score}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, score: e.target.value })}
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

        {/* Attributes Section */}
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

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" sx={{ fontSize: "16px", padding: "10px 20px", borderRadius: "8px" }}>
          Add Product
        </Button>
      </Box>
    </Container>
  );
}

export default AddProduct;
