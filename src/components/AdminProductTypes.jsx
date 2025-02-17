import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Chip,
  Grid,
} from "@mui/material";
import { Delete, AddCircle } from "@mui/icons-material";
import { fetchProductTypes } from "../api/products";
import { addProductType, deleteProductType } from "../api/admin";

const AdminProductTypes = ({ token }) => {
  const [productTypes, setProductTypes] = useState([]);
  const [newProductType, setNewProductType] = useState({ name: "", description: "", metadata_schema: {} });
  const [newAttribute, setNewAttribute] = useState({ name: "", type: "" });

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      const data = await fetchProductTypes();
      setProductTypes(data);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const handleAddProductType = async () => {
    if (!newProductType.name.trim() || !newProductType.description.trim()) {
      alert("Please fill in both name and description.");
      return;
    }
    try {
      const addedProductType = await addProductType(newProductType, token);
      setProductTypes([...productTypes, addedProductType]);
      setNewProductType({ name: "", description: "", metadata_schema: {} }); // Reset form
    } catch (error) {
      alert("Error adding product type.");
    }
  };

  const handleDeleteProductType = async (id) => {
    try {
      await deleteProductType(id, token);
      setProductTypes(productTypes.filter((type) => type.id !== id));
    } catch (error) {
      alert("Error deleting product type.");
    }
  };

  const handleAddAttribute = () => {
    if (!newAttribute.name.trim() || !newAttribute.type.trim()) {
      alert("Attribute name and type cannot be empty.");
      return;
    }
    setNewProductType((prev) => ({
      ...prev,
      metadata_schema: { ...prev.metadata_schema, [newAttribute.name]: newAttribute.type },
    }));
    setNewAttribute({ name: "", type: "" });
  };

  const handleRemoveAttribute = (attributeName) => {
    const updatedMetadata = { ...newProductType.metadata_schema };
    delete updatedMetadata[attributeName];
    setNewProductType((prev) => ({ ...prev, metadata_schema: updatedMetadata }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Manage Product Types
      </Typography>

      {/* Form to add a new product type */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={newProductType.name}
              onChange={(e) => setNewProductType({ ...newProductType, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={newProductType.description}
              onChange={(e) => setNewProductType({ ...newProductType, description: e.target.value })}
            />
          </Grid>
        </Grid>

        {/* Add Metadata Attributes */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Add Metadata Attributes
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Attribute Name"
              variant="outlined"
              value={newAttribute.name}
              onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Type (e.g., string, integer)"
              variant="outlined"
              value={newAttribute.type}
              onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value })}
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleAddAttribute}>
              Add Attribute
            </Button>
          </Grid>
        </Grid>

        {/* Display Added Attributes as Chips */}
        <Box mt={2}>
          {Object.keys(newProductType.metadata_schema).length > 0 && (
            <>
              <Typography variant="subtitle1">Attributes:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Object.entries(newProductType.metadata_schema).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    variant="outlined"
                    onDelete={() => handleRemoveAttribute(key)}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* Single Button to Add Product Type with Attributes */}
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={handleAddProductType}
          >
            Add Product Type
          </Button>
        </Box>
      </Paper>

      {/* Product Types Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Attributes</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {type.metadata_schema
                      ? Object.entries(type.metadata_schema).map(([attr, attrType]) => (
                          <Chip key={attr} label={`${attr}: ${attrType}`} variant="outlined" />
                        ))
                      : "No Attributes"}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteProductType(type.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminProductTypes;
