import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import appLogo from "../assets/app-logo.svg";
import { deepPurple } from "@mui/material/colors";

function Header({ username }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route path
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Check if on the Dashboard screen
  const isDashboard = location.pathname === "/";

  // Open the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigate to a route
  const handleMenuClick = (route) => {
    navigate(route);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Conditional Menu Button */}
        {!isDashboard && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuClick("/")}>Home</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/products")}>
                My products
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/comparisons")}>
                My commparisons
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addProduct")}>
                Add new product
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addComparison")}>
                Add new comparison
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Logo */}
        <Box display="flex" alignItems="center" flexGrow={1} marginLeft={!isDashboard ? 2 : 0}>
          <img src={appLogo} alt="App Logo" width="60" height="auto" />
          <Typography
        variant="h4" // Larger and bold text
        component="div"
        sx={{
          fontFamily: "'Lobster', cursive",
          marginLeft: 1, // Space between the logo and text
          color: "white", // Ensure the text is visible on the AppBar
        }}
      >
        Comparathor
      </Typography>
        </Box>

        {/* Configuration Icon and User Info */}
        <Box display="flex" alignItems="center">
          <IconButton
            edge="end"
            color="inherit"
            aria-label="settings"
            onClick={() => navigate("/config")}
            sx={{ marginRight: 2 }}
          >
            <SettingsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: deepPurple[500], marginRight: 1 }}>
            {username ? username[0].toUpperCase() : "U"}
          </Avatar>
          <Typography variant="body1" component="div">
            {username || "Guest"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
