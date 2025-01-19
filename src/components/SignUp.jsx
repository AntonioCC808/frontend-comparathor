import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Validación de contraseñas
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Sign up with:", { email, password });
    navigate("/"); // Redirige al Dashboard
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f4f4f9"
    >
      <Box
        bgcolor="white"
        padding={4}
        borderRadius={4}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
        maxWidth="400px"
        width="100%"
      >
        <Typography variant="h4" gutterBottom align="center">
          Create Account
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Sign up to start using Comparathor
        </Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
          sx={{ marginTop: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link
            href="#"
            onClick={() => navigate("/login")}
            underline="hover"
          >
            Log In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default SignUp;
