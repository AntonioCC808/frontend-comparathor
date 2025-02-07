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
  Button,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { fetchComparisons, deleteComparison } from "../api/comparisons";
import ComparisonModal from "./ComparisonModal"; // ✅ Modal Component

function MyComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch comparisons on component mount
  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await fetchComparisons();
        setComparisons(data);
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      }
    };
    loadComparisons();
  }, []);

  // Handle deleting a comparison
  const handleDelete = async (comparisonId) => {
    try {
      await deleteComparison(comparisonId);
      setComparisons(comparisons.filter((c) => c.id !== comparisonId));
    } catch (error) {
      console.error("Error deleting comparison:", error);
    }
  };

  // Open comparison modal
  const handleOpenModal = (comparison) => {
    setSelectedComparison(comparison);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        My Comparisons
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisons.map((comparison) => (
              <TableRow key={comparison.id}>
                <TableCell>{comparison.title}</TableCell>
                <TableCell>{comparison.description}</TableCell>
                <TableCell>{comparison.date_created}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(comparison)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(comparison.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Comparison Details */}
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
