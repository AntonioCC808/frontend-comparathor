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
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { fetchComparisons, deleteComparison } from "../api/comparisons";
import ComparisonModal from "./modals/ComparisonModal"; 

function MyComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleDelete = async (comparisonId) => {
    try {
      await deleteComparison(comparisonId);
      setComparisons(comparisons.filter((c) => c.id !== comparisonId));
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date Created</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisons.map((comparison) => (
              <TableRow key={comparison.id}>
                <TableCell>{comparison.title}</TableCell>
                <TableCell>{comparison.description}</TableCell>
                <TableCell>{comparison.date_created}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton color="primary" onClick={() => handleOpenModal(comparison)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(comparison.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
