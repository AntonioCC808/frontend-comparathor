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

  const handleProfileClick = () => {
    navigate("/config"); // ✅ Navigate to settings page
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("Logging out...");
  
    // ✅ Clear authentication data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  
    // ✅ Navigate to login page
    navigate("/");
  
    // ✅ Close the menu
    handleMenuClose();
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
        <MenuItem disabled>
          <Typography variant="body1">Hi, {username}</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClick}>Profile Settings</MenuItem> {/* ✅ Profile Button */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Typography variant="body1" component="div" sx={{ marginLeft: 1 }}>
        {username || "Guest"}
      </Typography>
    </>
  );
};

export default UserMenu;
