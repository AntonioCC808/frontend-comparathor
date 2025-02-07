import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material"; // Upload icon
import { fetchProductTypes, addProduct } from "../api/products";

function AddProduct() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    brand: "",
    score: "",
    image_base64: "", // Store Base64 image
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

  const handleTypeChange = (event) => {
    const selectedType = productTypes.find(
      (type) => type.id === parseInt(event.target.value)
    );

    const metadataSchema = Object.entries(selectedType.metadata_schema || {}).map(
      ([key, type]) => ({
        attribute: key,
        type: type,
        value: "",
      })
    );

    setSelectedProduct({
      ...selectedProduct,
      product_type: selectedType.id,
      product_metadata: metadataSchema,
    });
  };

  const handleAttributeChange = (index, key, value) => {
    const updatedMetadata = [...selectedProduct.product_metadata];
    updatedMetadata[index][key] = value;
    setSelectedProduct({ ...selectedProduct, product_metadata: updatedMetadata });
  };

  // Handle Image Upload and Convert to Base64
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProduct({ ...selectedProduct, image_base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle File Drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct.name || !selectedProduct.product_type) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        ...selectedProduct,
        id_user: 1, // Replace with actual user ID
      };
      await addProduct(payload);
      alert("Product added successfully!");

      setSelectedProduct({
        name: "",
        brand: "",
        score: "",
        image_base64: "",
        product_type: "",
        product_metadata: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mt: 3 }}
      >
        Add New Product
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
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
          onChange={handleTypeChange}
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
          value={selectedProduct.name}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, name: e.target.value })
          }
        />
        <TextField
          label="Brand"
          fullWidth
          margin="dense"
          value={selectedProduct.brand}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, brand: e.target.value })
          }
        />
        <TextField
          label="Score"
          fullWidth
          margin="dense"
          type="number"
          value={selectedProduct.score}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, score: e.target.value })
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
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("imageUpload").click()}
        >
          <CloudUpload sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Drag & drop or click to upload image
          </Typography>
        </Box>

        {/* Hidden File Input */}
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          style={{ display: "none" }}
        />

        {/* Image Preview */}
        {selectedProduct.image_base64 && (
          <img
            src={selectedProduct.image_base64}
            alt="Product Preview"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "contain",
              marginTop: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        )}

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
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
              />
            ))}
          </>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ fontSize: "16px", padding: "10px 20px", borderRadius: "8px" }}
        >
          Add Product
        </Button>
      </Box>
    </Container>
  );
}

export default AddProduct;
