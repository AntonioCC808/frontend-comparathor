import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import appLogo from "../assets/app-logo.svg";
import UserMenu from "./UserMenu"; // Import the new component

function Header({ username }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const isDashboard = location.pathname === "/";

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuClick = (route) => {
    navigate(route);
    setMenuAnchorEl(null);
  };
  console.log(username)

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

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuClick("/home")}>Home</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/products")}>
                My Products
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/comparisons")}>
                My Comparisons
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addProduct")}>
                Add New Product
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addComparison")}>
                Add New Comparison
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Logo */}
        <Box display="flex" alignItems="center" flexGrow={1} marginLeft={!isDashboard ? 2 : 0}>
          <img src={appLogo} alt="App Logo" width="60" height="auto" />
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontFamily: "'Lobster', cursive",
              marginLeft: 1,
              color: "white",
            }}
          >
            Comparathor
          </Typography>
        </Box>

        {/* Configuration Icon and User Menu */}
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
          <UserMenu username={username} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
