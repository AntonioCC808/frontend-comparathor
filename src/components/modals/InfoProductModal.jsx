import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { Rating } from "@mui/material"; // Import Rating component

const InfoProductModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Product Details
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          {/* Product Image */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              height: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              border: "3px solid #ddd",
              overflow: "hidden",
            }}
          >
            <img
              src={product.image_base64}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Product Name, Brand, Price, Score */}
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            {product.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#555", textAlign: "center" }}>
            Brand: {product.brand}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#555", textAlign: "center" }}>
            Price: €{product.price}
          </Typography>

          {/* Overall Score with Stars */}
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="subtitle1" sx={{ color: "#555", mr: 1 }}>
              Score:
            </Typography>
            <Rating value={product.score} precision={0.1} readOnly />
          </Box>
        </Box>

        {/* Attributes Section */}
        {product.product_metadata.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
              Attributes
            </Typography>
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Value</b></TableCell>
                  <TableCell><b>Score</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.product_metadata.map((meta, index) => (
                  <TableRow key={index}>
                    <TableCell>{meta.attribute}</TableCell>
                    <TableCell>{meta.value}</TableCell>
                    <TableCell>
                      <Rating value={meta.score} precision={0.1} readOnly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            No metadata available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" fullWidth sx={{ mt: 1 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoProductModal;
