import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { login, setAuthToken } from "../api/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login({ handleAuthChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // Track login errors
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    setErrors({}); // Reset errors before request
  
    try {
      const response = await login(email, password); // Call API
      const { access_token, user_id, role } = response; // Destructure API response
  
      if (!access_token || !user_id) {
        throw new Error("Invalid response from server.");
      }
  
      // Store authentication details securely
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify({ user_id, email, role }));
  
      setAuthToken(access_token); // Set the token globally
      handleAuthChange(true, { user_id, email, role });
  
      console.log("Login successful! Redirecting to '/home'", { user_id, email, role });
      navigate("/home"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
  
      let fieldErrors = {};
  
      // Handle validation errors from API response
      if (error.response?.data?.detail) {
        const apiErrors = error.response.data.detail;
  
        if (Array.isArray(apiErrors)) {
          apiErrors.forEach((err) => {
            if (err.loc?.includes("email")) fieldErrors.email = err.msg;
            if (err.loc?.includes("password")) fieldErrors.password = err.msg;
          });
        } else {
          fieldErrors.general = apiErrors || "Invalid credentials. Please try again.";
        }
      } else {
        fieldErrors.general = "An error occurred. Please try again.";
      }
  
      setErrors(fieldErrors);
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

        {/* Show Error Message */}
        {errors.general && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
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

Login.propTypes = {
  handleAuthChange: PropTypes.func.isRequired,
};

export default Login;
