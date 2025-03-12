import React, { useState, useEffect } from "react";
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
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Delete, Visibility, Edit } from "@mui/icons-material";
import { fetchComparisons, deleteComparison, updateComparison } from "../api/comparisons";

function MyComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [filteredComparisons, setFilteredComparisons] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editData, setEditData] = useState({ title: "", description: "" });

  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await fetchComparisons();
        setComparisons(data);
        setFilteredComparisons(data);
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      }
    };
    loadComparisons();
  }, []);

  useEffect(() => {
    const filtered = comparisons.filter(
      (comparison) =>
        comparison.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        comparison.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredComparisons(filtered);
  }, [searchKeyword, comparisons]);

  const handleDelete = async (comparisonId) => {
    try {
      await deleteComparison(comparisonId);
      const updatedComparisons = comparisons.filter((c) => c.id !== comparisonId);
      setComparisons(updatedComparisons);
      setFilteredComparisons(updatedComparisons);
    } catch (error) {
      console.error("Error deleting comparison:", error);
    }
  };

  const handleOpenModal = (comparison) => {
    setSelectedComparison(comparison);
    setModalOpen(true);
  };

  const handleOpenEditModal = (comparison) => {
    setEditData({ title: comparison.title, description: comparison.description });
    setSelectedComparison(comparison);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedComparison = {
        title: editData.title,
        description: editData.description,
      };
  
      await updateComparison(selectedComparison.id, updatedComparison);
  
      const updatedComparisons = comparisons.map((c) =>
        c.id === selectedComparison.id ? { ...c, ...updatedComparison } : c
      );
  
      setComparisons(updatedComparisons);
      setFilteredComparisons(updatedComparisons);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating comparison:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        MY COMPARISONS
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search by title or description..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ width: "100%", maxWidth: "400px", backgroundColor: "white", borderRadius: "8px" }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date Created</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComparisons.length > 0 ? (
              filteredComparisons.map((comparison) => (
                <TableRow key={comparison.id}>
                  <TableCell>{comparison.title}</TableCell>
                  <TableCell>{comparison.description}</TableCell>
                  <TableCell>{comparison.date_created}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center">
                      <IconButton color="primary" onClick={() => handleOpenModal(comparison)}>
                        <Visibility />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleOpenEditModal(comparison)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(comparison.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="textSecondary">No comparisons found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Comparison</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth name="title" value={editData.title} onChange={handleEditChange} margin="dense" />
          <TextField label="Description" fullWidth name="description" value={editData.description} onChange={handleEditChange} margin="dense" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyComparisons;
