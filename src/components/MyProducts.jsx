import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
} from "@mui/material";
import { Edit, Delete, Add, Info } from "@mui/icons-material";
import {
  loadProducts,
  handleEditProduct,
  handleAddProduct,
  handleViewProduct,
  handleCloseModals,
  handleDeleteConfirmation,
  handleDeleteConfirmed,
  handleSaveChanges,
  handleAttributeChange,
} from "../utils/productHandlers";
import ProductModal from "./ProductModal";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]); // Store product types
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    loadProducts(setProducts);
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Products
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "10%" }}>Image</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Product Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Brand</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Score</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image_url || "https://via.placeholder.com/50"}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{product.score}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Tooltip title="View Details">
                    <IconButton color="primary" onClick={() => handleViewProduct(product, setSelectedProduct, setIsInfoModalOpen)}>
                      <Info />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="info" onClick={() => handleEditProduct(product, setSelectedProduct, setIsEditing, setIsModalOpen)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteConfirmation(product, setProductToDelete, setIsConfirmOpen)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


  {/* Add Product Button */}
  <Button
    variant="contained"
    color="primary"
    startIcon={<Add />}
    onClick={() =>
      handleAddProduct(setSelectedProduct, setIsEditing, setIsModalOpen, setProductTypes)
    }
  >
    Add Product
  </Button>

  {/* Add Product Modal */}
  <ProductModal
    open={isModalOpen}
    onClose={() => handleCloseModals(setSelectedProduct, setIsModalOpen)}
    selectedProduct={selectedProduct}
    setSelectedProduct={setSelectedProduct}
    productTypes={productTypes}
    handleAttributeChange={handleAttributeChange}
    handleSaveChanges={handleSaveChanges}
  />
{/* Info Modal */}
<Dialog open={isInfoModalOpen} onClose={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)}>
  <DialogTitle>Product Details</DialogTitle>
  <DialogContent>
    {selectedProduct && (
      <>
        <img
          src={selectedProduct.image_url || "https://via.placeholder.com/150"}
          alt={selectedProduct.name}
          style={{ width: "100%", maxHeight: "250px", objectFit: "cover", marginBottom: "10px" }}
        />
        <Typography variant="h6">{selectedProduct.name}</Typography>
        <Typography variant="subtitle1">Brand: {selectedProduct.brand}</Typography>
        <Typography variant="subtitle1">Score: {selectedProduct.score}</Typography>

        {selectedProduct.product_metadata.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Attributes</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Attribute</b></TableCell>
                  <TableCell><b>Value</b></TableCell>
                  <TableCell><b>Score</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProduct.product_metadata.map((meta) => (
                  <TableRow key={meta.id}>
                    <TableCell>{meta.attribute}</TableCell>
                    <TableCell>{meta.value}</TableCell>
                    <TableCell>{meta.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <Typography variant="body2">No metadata available</Typography>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => handleCloseModals(setSelectedProduct, setIsInfoModalOpen)} color="secondary">
      Close
    </Button>
  </DialogActions>
    </Dialog>
      {/* Edit Product Modal */}
      <Dialog open={isModalOpen} onClose={() => handleCloseModals(setSelectedProduct, setIsModalOpen, setIsInfoModalOpen)}>
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <TextField label="Product Name" fullWidth margin="dense" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
              <TextField label="Brand" fullWidth margin="dense" value={selectedProduct.brand} onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })} />
              <TextField label="Score" fullWidth margin="dense" type="number" value={selectedProduct.score} onChange={(e) => setSelectedProduct({ ...selectedProduct, score: e.target.value })} />
              <TextField label="Image URL" fullWidth margin="dense" value={selectedProduct.image_url || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, image_url: e.target.value })} />

              <Typography variant="h6" sx={{ mt: 2 }}>Attributes</Typography>
              {selectedProduct.product_metadata.map((meta, index) => (
                <Box key={meta.id} sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <TextField label="Attribute" fullWidth margin="dense" value={meta.attribute} onChange={(e) => handleAttributeChange(index, "attribute", e.target.value)} />
                  <TextField label="Value" fullWidth margin="dense" value={meta.value} onChange={(e) => handleAttributeChange(index, "value", e.target.value)} />
                  <TextField label="Score" fullWidth margin="dense" type="number" value={meta.score} onChange={(e) => handleAttributeChange(index, "score", e.target.value)} />
                </Box>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModals(setSelectedProduct, setIsModalOpen, setIsInfoModalOpen)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {productToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyProducts;
