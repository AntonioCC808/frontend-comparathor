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
} from "@mui/material";
import { fetchComparisonDetails } from "../api/comparisons"; // ✅ Fetch products in a comparison

function ComparisonModal({ open, onClose, comparison }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchComparisonDetails(comparison.id);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching comparison details:", error);
      }
    };
    if (open) {
      loadProducts();
    }
  }, [open, comparison.id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Comparison: {comparison.title}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attribute</TableCell>
                {products.map((product) => (
                  <TableCell key={product.id}>{product.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Generate rows dynamically based on attributes */}
              {products.length > 0 &&
                Object.keys(products[0].product_metadata).map((attribute) => (
                  <TableRow key={attribute}>
                    <TableCell>{attribute}</TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id}>
                        {product.product_metadata[attribute]?.value || "N/A"} 
                        (Score: {product.product_metadata[attribute]?.score || "N/A"})
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ComparisonModal;
