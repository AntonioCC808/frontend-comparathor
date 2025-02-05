import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { fetchComparisons, deleteComparison } from "../api/comparisons";
import ComparisonModal from "./ComparisonModal"; // Assuming you have a modal for adding comparisons

function MyComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch comparisons on component load
  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const comparisonsData = await fetchComparisons();
        setComparisons(comparisonsData);
      } catch (error) {
        console.error("Error fetching comparisons:", error);
      }
    };
    loadComparisons();
  }, []);

  // Handle adding a new comparison
  const handleAddComparison = (newComparison) => {
    setComparisons([...comparisons, newComparison]);
    setIsModalOpen(false);
  };

  // Handle deleting a comparison
  const handleDelete = async (comparisonId) => {
    try {
      await deleteComparison(comparisonId);
      setComparisons(comparisons.filter((comparison) => comparison.id !== comparisonId));
    } catch (error) {
      console.error("Error deleting comparison:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        My Comparisons
      </Typography>
      <List>
        {comparisons.map((comparison) => (
          <ListItem
            key={comparison.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                color="error"
                onClick={() => handleDelete(comparison.id)}
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={comparison.title} />
          </ListItem>
        ))}
      </List>
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Add Comparison
        </Button>
      </Box>
      {/* Add ComparisonModal */}
      <ComparisonModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComparisonAdded={handleAddComparison}
      />
    </Container>
  );
}

export default MyComparisons;
