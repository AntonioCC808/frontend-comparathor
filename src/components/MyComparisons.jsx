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
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { fetchComparisons, deleteComparison } from "../api/comparisons";
import ComparisonModal from "./modals/ComparisonModal"; 

function MyComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [filteredComparisons, setFilteredComparisons] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await fetchComparisons();
        setComparisons(data);
        setFilteredComparisons(data); // Initialize with all comparisons
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      }
    };
    loadComparisons();
  }, []);

  useEffect(() => {
    // Filtering logic: search by Title or Description
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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        MY COMPARISONS
      </Typography>

      {/* Search Bar */}
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

      {selectedComparison && (
        <ComparisonModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          comparison={selectedComparison}
        />
      )}
    </Container>
  );
}

export default MyComparisons;
