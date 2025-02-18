import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
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
import AppLogo from "../assets/app-logo.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function SignUp() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({}); // Object to track field errors

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setErrors({});
    setSuccessMessage(null);
  
    let newErrors = {};
  
    // Basic validation before sending API request
    if (!userId) newErrors.userId = "User ID is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      await register(userId, email, password, role);
      setSuccessMessage("✅ Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
  
      let fieldErrors = {};
  
      const apiErrors = error.response?.data.detail;
      console.log("🔍 API Error Detail:", apiErrors);
  
      if (typeof apiErrors === "string") {
        // ✅ Backend sent a single error message
        fieldErrors.general = apiErrors;
      } else if (Array.isArray(apiErrors)) {
        // ✅ Backend sent multiple validation errors
        apiErrors.forEach((err) => {
          console.log("🔹 Processing Error:", err);
  
          if (err.loc?.includes("User ID")) fieldErrors.userId = err.msg;
          if (err.loc?.includes("Email")) fieldErrors.email = err.msg;
          if (err.loc?.includes("email")) fieldErrors.email = err.msg;
          if (err.loc?.includes("password")) fieldErrors.password = err.msg;
        });
      } else {
        fieldErrors.general = "Unexpected error occurred. Please try again.";
      }
  
      setErrors(fieldErrors);
    }
  };
  

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f4f4f9">
        <Box
          bgcolor="white"
          padding={4}
          borderRadius={4}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
          maxWidth="400px"
          width="100%"
          textAlign="center"
        >
        {/* App Logo */}
        <Box mb={2}>
          <img src={AppLogo} alt="App Logo" style={{ width: "120px", height: "auto" }} />
        </Box>
        <Typography variant="h4" gutterBottom align="center">
          Create Account
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Sign up to start using Comparathor
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errors.general && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          label="User ID"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          error={Boolean(errors.userId)}
          helperText={errors.userId}
        />

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

        <TextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
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

        <Button variant="contained" color="primary" fullWidth onClick={handleSignUp} sx={{ marginTop: 2 }}>
          Sign Up
        </Button>

         {/* Navigate to Public Page */}
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate("/")}
                  sx={{ marginTop: 1 }}
                >
                  Continue Without Logging In
                </Button>
        

        <Typography variant="body2" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link href="#" onClick={() => navigate("/login")} underline="hover">
            Log In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default SignUp;
