import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Typography } from "@mui/material";
import { logout } from "../api/auth"; 
import { useNavigate } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";

const UserMenu = ({ username, setUser }) => { // ✅ Accept setUser prop
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/config");
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("🔴 Logging out user menu...");
    handleMenuClose();
  
    logout(); // ✅ Clears tokens and headers
    setUser(null); // ✅ Updates React state
  
    // ✅ Ensure a full reload to clear any lingering state
    setTimeout(() => {
      window.location.href = "/login";  // ✅ Full reload, forces re-render
    }, 100);
  };
  
  
  
  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Avatar sx={{ bgcolor: deepPurple[500] }}>
          {username ? username[0].toUpperCase() : "U"}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem disabled>
          <Typography variant="body1">Hi, {username}</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileClick}>Profile Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* ✅ Calls handleLogout */}
      </Menu>
    </>
  );
};

export default UserMenu;
