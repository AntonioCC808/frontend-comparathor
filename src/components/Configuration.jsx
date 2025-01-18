import React from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';

function Configuration() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Configuration
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Update Email"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Change Password"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Change Username"
          variant="outlined"
          margin="normal"
        />
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" size="large">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Configuration;
