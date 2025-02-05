import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { createComparison } from "../api/comparisons";

function ComparisonModal({ open, onClose, onComparisonAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const newComparison = await createComparison({ title, description });
      onComparisonAdded(newComparison);
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error adding comparison:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Comparison</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Comparison Title"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ComparisonModal;
