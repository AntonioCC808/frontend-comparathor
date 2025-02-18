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
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Rating } from "@mui/material"; // Import Rating component
import { fetchComparisonDetails } from "../../api/comparisons";

function ComparisonModal({ open, onClose, comparison }) {
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "score", descending: true });

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
  const uniqueAttributes = new Set();
  products.forEach((product) => {
    product?.product?.product_metadata?.forEach(({ attribute }) => {
      uniqueAttributes.add(attribute);
    });
  });

  // Find the maximum total score
  const maxTotalScore = Math.max(...products.map((product) => product.product.score));

  // Sorting function based on selected column
  const sortedProducts = [...products].sort((a, b) => {
    const key = sortConfig.key;

    const getValue = (product) => {
      if (key === "score") return product.product.score;
      if (key === "name") return product.product.name.toLowerCase();
      const metadata = product.product.product_metadata.find((meta) => meta.attribute === key);
      return metadata ? parseFloat(metadata.score) : -Infinity;
    };

    const valueA = getValue(a);
    const valueB = getValue(b);

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.descending ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
    }

    return sortConfig.descending ? valueB - valueA : valueA - valueB;
  });

  // Toggle sorting configuration
  const handleSort = (attribute) => {
    setSortConfig((prev) => ({
      key: attribute,
      descending: prev.key === attribute ? !prev.descending : true,
    }));
  };

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
                {/* Product Name Column */}
                <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}>
                  Product
                  <IconButton onClick={() => handleSort("name")} sx={{ color: "white" }}>
                    {sortConfig.key === "name" && sortConfig.descending ? <ArrowDownward /> : <ArrowUpward />}
                  </IconButton>
                </TableCell>

                {/* Dynamic Attribute Columns */}
                {[...uniqueAttributes].map((attribute) => (
                  <TableCell
                    key={attribute}
                    sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
                  >
                    {attribute}
                    <IconButton onClick={() => handleSort(attribute)} sx={{ color: "white" }}>
                      {sortConfig.key === attribute && sortConfig.descending ? <ArrowDownward /> : <ArrowUpward />}
                    </IconButton>
                  </TableCell>
                ))}

                {/* Total Score Column */}
                <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>
                  Total Score
                  <IconButton onClick={() => handleSort("score")} sx={{ color: "white" }}>
                    {sortConfig.key === "score" && sortConfig.descending ? <ArrowDownward /> : <ArrowUpward />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {sortedProducts.map((product) => {
                const isBest = product.product.score === maxTotalScore;

                return (
                  <TableRow key={product.id} sx={{ backgroundColor: isBest ? "#d4edda" : "inherit" }}>
                    {/* Product Name */}
                    <TableCell sx={{ fontWeight: "bold" }}>{product.product.name}</TableCell>

                    {/* Attribute Values with Stars Below */}
                    {[...uniqueAttributes].map((attribute) => {
                      const metadata = product.product.product_metadata.find(
                        (meta) => meta.attribute === attribute
                      );
                      const value = metadata ? metadata.value : "N/A";
                      const score = metadata ? parseFloat(metadata.score) : 0;

                      return (
                        <TableCell key={attribute} sx={{ textAlign: "center", padding: "8px" }}>
                          <Typography variant="body1" fontWeight="bold">
                            {value}
                          </Typography>
                          <Tooltip title={`Score: ${score}`}>
                            <Rating value={score} precision={0.1} readOnly />
                          </Tooltip>
                        </TableCell>
                      );
                    })}

                    {/* Total Score - Only Stars, No Text */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title={`Score: ${product.product.score}`}>
                        <Rating value={product.product.score} precision={0.1} readOnly />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
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
