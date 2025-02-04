import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { login, setAuthToken } from "../api/auth";
import { Box, TextField, Button, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async () => {
    try {
      const { access_token } = await login(email, password);
      localStorage.setItem("access_token", access_token);
      setAuthToken(access_token);
      setIsAuthenticated(true);
      navigate(from);
    } catch (error) {
      console.error("Login error:", error.response?.data?.detail || error.message);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f4f4f9">
      <Box bgcolor="white" padding={4} borderRadius={4} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)" maxWidth="400px" width="100%">
        <Typography variant="h4" gutterBottom align="center">
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please log in to continue
        </Typography>
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type={showPassword ? "text" : "password"} fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2 }}>
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

// Define PropTypes for the Login component
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
