import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import appLogo from "../assets/app-logo.svg";
import UserMenu from "./UserMenu";

function Header({ username, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

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
      <Container maxWidth="lg"> 
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", 
            px: 2, // Padding horizontal
          }}
        >
          {/* Menú de Navegación */}
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleMenuClick("/home")}>Home</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/products")}>My Products</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/comparisons")}>My Comparisons</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addProduct")}>Add New Product</MenuItem>
              <MenuItem onClick={() => handleMenuClick("/addComparison")}>Add New Comparison</MenuItem>
            </Menu>
          </Box>

          {/* Logo y Nombre de la App */}
          <Box display="flex" alignItems="center">
            <img src={appLogo} alt="App Logo" width="40" height="40" />
            <Typography variant="h6" component="div" sx={{ ml: 1, color: "white", fontWeight: "bold" }}>
              Comparathor
            </Typography>
          </Box>

          {/* Menú de Usuario */}
          <UserMenu username={username} setUser={setUser} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
