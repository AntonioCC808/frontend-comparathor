import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { fetchProductTypes, addProduct } from "../api/products";

function AddProduct() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    brand: "",
    score: "",
    image_url: "",
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

    // Convert metadata schema from object to array
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

      // Reset form
      setSelectedProduct({
        name: "",
        brand: "",
        score: "",
        image_url: "",
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
        <TextField
          label="Image URL"
          fullWidth
          margin="dense"
          value={selectedProduct.image_url}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, image_url: e.target.value })
          }
        />

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
