import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";

const UserMenu = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Open the user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle log out
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/"); // Redirect to login page
    handleMenuClose(); // Close the menu
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar sx={{ bgcolor: deepPurple[500] }}>
          {username ? username[0].toUpperCase() : "U"}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
      <Typography variant="body1" component="div" sx={{ marginLeft: 1 }}>
        {username || "Guest"}
      </Typography>
    </>
  );
};

export default UserMenu;
