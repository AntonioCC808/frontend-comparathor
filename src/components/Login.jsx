import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get the 'from' location or default to '/home'
  const from = location.state?.from?.pathname;

  const handleLogin = () => {
    console.log("Login with:", { email, password });
    localStorage.setItem("isAuthenticated", "true"); // Save auth state
    setIsAuthenticated(true);
    navigate(from); // Redirect to the intended route or default
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
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please log in to continue
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
        <Typography variant="body2" align="center" marginTop={2}>
          Don't have an account?{" "}
          <Link href="#" onClick={() => navigate("/signup")} underline="hover">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
