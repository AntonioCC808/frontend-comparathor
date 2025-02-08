import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { fetchComparisonDetails } from "../api/comparisons";

function ComparisonModal({ open, onClose, comparison }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!comparison?.id) return;
      try {
        const data = await fetchComparisonDetails(comparison.id);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching comparison details:", error);
      }
    };

    if (open && comparison) {
      loadProducts();
    }
  }, [open, comparison?.id]);

  if (!comparison) return null;

  // Extract unique attributes dynamically
  const uniqueAttributes = products.reduce((acc, product) => {
    product?.product?.product_metadata?.forEach(({ attribute }) => {
      acc.add(attribute);
    });
    return acc;
  }, new Set());

  // Find the best value for each attribute
  const bestValues = {};
  [...uniqueAttributes].forEach((attribute) => {
    bestValues[attribute] = Math.max(
      ...products.map((product) => {
        const metadata = product.product.product_metadata.find(
          (meta) => meta.attribute === attribute
        );
        return metadata ? parseFloat(metadata.score) : -Infinity;
      })
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Comparison: {comparison.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            {/* Table Header */}
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}>
                  Attribute
                </TableCell>
                {products.map((product) => (
                  <TableCell
                    key={product.id}
                    sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {product.product.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {[...uniqueAttributes].map((attribute) => (
                <TableRow key={attribute}>
                  <TableCell sx={{ fontWeight: "bold" }}>{attribute}</TableCell>
                  {products.map((product) => {
                    const metadata = product.product.product_metadata.find(
                      (meta) => meta.attribute === attribute
                    );
                    const isBest = metadata && parseFloat(metadata.score) === bestValues[attribute];

                    return (
                      <TableCell
                        key={product.id}
                        sx={{
                          backgroundColor: isBest ? "#d4edda" : "inherit", // Highlight best value
                          fontWeight: isBest ? "bold" : "normal",
                          borderRadius: 1,
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body1">{metadata?.value || "N/A"}</Typography>
                        <Typography variant="caption" sx={{ color: "#555" }}>
                          (Score: {metadata?.score || "N/A"})
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ComparisonModal;
