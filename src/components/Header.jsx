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
import { useNavigate, useLocation } from "react-router-dom";
import appLogo from "../assets/app-logo.svg";
import UserMenu from "./UserMenu";

function Header({ username, setUser }) {
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

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {!isDashboard && (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>

            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleMenuClick("/home")}>Home</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/products")}>My Products</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/comparisons")}>My Comparisons</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addProduct")}>Add New Product</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addComparison")}>Add New Comparison</MenuItem>
            </Menu>
          </>
        )}

        <Box display="flex" alignItems="center" flexGrow={1} marginLeft={!isDashboard ? 2 : 0}>
          <img src={appLogo} alt="App Logo" width="60" height="auto" />
          <Typography variant="h4" component="div" sx={{ fontFamily: "'Verdana', cursive", marginLeft: 1, color: "white" }}>
            Comparathor
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
        <UserMenu username={username} setUser={setUser} /> {/* ✅ Pass setUser */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
