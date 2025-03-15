import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  TextField,
  Button,
  Box,
  Select,
  Chip,
  Grid,
} from "@mui/material";
import { Delete, AddCircle } from "@mui/icons-material";
import { fetchProductTypes } from "../api/products";
import { addProductType, deleteProductType, fetchUsers, updateUsersRoles } from "../api/admin";

const AdminProductTypes = ({ token }) => {
  const [productTypes, setProductTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProductType, setNewProductType] = useState({ name: "", description: "", metadata_schema: {} });
  const [newAttribute, setNewAttribute] = useState({ name: "", type: "" });
  const [userRoles, setUserRoles] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProductTypes();
    loadUsers();
  }, []);
  const loadProductTypes = async () => {
    try {
      const data = await fetchProductTypes();
      setProductTypes(data);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(token);
      setUsers(data);
  
      const roles = data.reduce((acc, user) => {
        const normalizedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
        acc[user.user_id] = normalizedRole; 
        return acc;
      }, {});
  
      setUserRoles(roles);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSaveRoles = async () => {
    try {
      const usersRolesArray = users.map(user => ({
        user_id: user.user_id,
        role: userRoles[user.user_id]?.toLowerCase() || user.role.toLowerCase(),
      }));
      await updateUsersRoles(usersRolesArray);
      loadUsers();
      
      setSuccessMessage("User roles updated successfully!");
      setErrorMessage(""); // Clear error message
      setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide after 3 seconds
    } catch (error) {
      console.error("Error updating user roles:", error);
      setErrorMessage("Failed to update user roles.");
      setSuccessMessage(""); // Clear success message
      setTimeout(() => setErrorMessage(""), 3000); // Auto-hide after 3 seconds
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
      <Typography variant="h4" gutterBottom align="left" mt={3}>
        Product type management
      </Typography>

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

       {/* Form to add a new product type */}

       <Typography variant="h5" gutterBottom align="left" sx={{ padding: 3, marginTop: 4, borderRadius: 2 }}>
        Create new product type
      </Typography>
       <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 2 }}>
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
        <Typography variant="h6" sx={{ mt: 4 }}>
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
            select
            fullWidth
            label="Type"
            value={newAttribute.type}
            onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value })}
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="integer">Integer</MenuItem>
            <MenuItem value="float">Float</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </TextField>
          </Grid>
          <Grid item xs={2}>
          <Button onClick={handleAddAttribute}>
          <AddCircle />
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
        <Box mt={3} display="flex" justifyContent="left">
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

      <Typography variant="h4" gutterBottom align="left" mt={7}>
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                <Select
                value={userRoles[user.user_id] ?? "User"}
                onChange={(e) => {
                  const newRole = e.target.value;
                  if (userRoles[user.user_id] === "User" && newRole === "Admin") {
                    setUserRoles({ ...userRoles, [user.user_id]: newRole });
                  }
                }}
                fullWidth
                disabled={userRoles[user.user_id] === "Admin"} // Disable if already Admin
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Success & Error Messages */}
    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
    {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Box mt={3} mb={3} display="flex" justifyContent="left">
        <Button variant="contained" color="primary" onClick={handleSaveRoles}>
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default AdminProductTypes;
