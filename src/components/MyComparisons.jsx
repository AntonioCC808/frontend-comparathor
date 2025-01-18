import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

function MyComparisons() {
  const comparisons = ["Samsung vs LG", "iPhone vs Xiaomi"];

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        My Comparisons
      </Typography>
      <List>
        {comparisons.map((comparison, index) => (
          <ListItem key={index}>
            <ListItemText primary={comparison} />
            <IconButton edge="end" aria-label="delete" color="error">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box textAlign="center" mt={4}>
        <Typography variant="subtitle1">Click a comparison to view details.</Typography>
      </Box>
    </Container>
  );
}

export default MyComparisons;
