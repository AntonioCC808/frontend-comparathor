import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import { fetchUserSettings, updateUserSettings } from "../api/settings"; // Import API functions

function Configuration() {
  const [user, setUser] = useState({
    email: "",
    user_id: "",
    profilePicture: "",
  });
  const [updatedUser, setUpdatedUser] = useState({
    email: "",
    user_id: "",
    password: "", // Ensure controlled state for password
  });
  
  const [loading, setLoading] = useState(false);

  // Fetch user data on component load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserSettings();
        console.log("🔹 User Data Loaded:", userData); // Debugging Log
        if (userData) {
          setUser(userData);
          setUpdatedUser(userData);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    setUpdatedUser({
      ...updatedUser,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const updatedData = {
        email: updatedUser.email,
        username: updatedUser.username,
      };
  
      // Only send password if it's changed
      if (updatedUser.password) {
        updatedData.password = updatedUser.password;
      }
  
      await updateUserSettings(updatedData);
      setUser(updatedData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile.");
    }
  
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        User Settings
      </Typography>
      <Card sx={{ maxWidth: 600, margin: "auto", mt: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={user.profilePicture || "/default-profile.png"} // Default image
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <Typography variant="h6">{user.username || "Unknown User"}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
          fullWidth
          label="Update Email"
          variant="outlined"
          margin="normal"
          name="email"
          value={updatedUser.email || ""} // Ensures it's always a string
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Change Username"
          variant="outlined"
          margin="normal"
          name="username"
          value={updatedUser.user_id || ""}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Change Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="password"
          value={updatedUser.password || ""} // Ensures controlled input
          onChange={handleChange}
        />

          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}

export default Configuration;
