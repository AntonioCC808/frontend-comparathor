import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";

const ProductModal = ({
  open,
  onClose,
  selectedProduct,
  setSelectedProduct,
  productTypes,
  handleAttributeChange,
  handleSaveChanges,
}) => {
  if (!selectedProduct) return null; // Prevents rendering empty modal
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        {/* Product Type Selector */}
        <TextField
          select
          label="Product Type"
          fullWidth
          margin="dense"
          value={selectedProduct.product_type || ""}
          onChange={(e) => {
            const selectedType = productTypes.find(
              (type) => type.id === parseInt(e.target.value)
            );
          
            // Convert object to array of key-value pairs
            const metadataSchema = Object.entries(selectedType.metadata_schema || {}).map(([key, type]) => ({
              attribute: key,
              type: type,
              value: "",
            }));
          
            console.log("Converted Metadata Schema:", metadataSchema);
          
            setSelectedProduct({
              ...selectedProduct,
              product_type: selectedType.id,
              product_metadata: metadataSchema,
            });
          }}
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
        <TextField
          label="Image URL"
          fullWidth
          margin="dense"
          value={selectedProduct.image_url || ""}
          onChange={(e) =>
            setSelectedProduct({ ...selectedProduct, image_url: e.target.value })
          }
        />

        {/* Attributes Section */}
        {selectedProduct.product_metadata?.map((meta, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              label={meta.attribute}
              fullWidth
              margin="dense"
              type={meta.type === "number" ? "number" : "text"}
              value={meta.value}
              onChange={(e) =>
                handleAttributeChange(index, "value", e.target.value)
              }
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} color="primary">
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
