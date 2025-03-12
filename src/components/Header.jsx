import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import CompareIcon from "@mui/icons-material/Compare";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import appLogo from "../assets/app-logo.svg";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const handleMenuClick = (route) => {
    navigate(route);
    setDrawerOpen(false);
  };

  console.log("User in Header:", user);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", boxShadow: 3, width: "100%" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        
        {/* Menu Icon (Visible on Mobile) */}
        <IconButton color="inherit" onClick={toggleDrawer(true)} sx={{ display: "block" }}>
          <MenuIcon />
        </IconButton>

        {/* Sidebar Drawer (Always Available) */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
              {[
                { text: "Home", icon: <HomeIcon />, route: "/home" },
                { text: "My Products", icon: <InventoryIcon />, route: "/products" },
                { text: "My Comparisons", icon: <CompareIcon />, route: "/comparisons" },
                { text: "Add New Product", icon: <AddBoxIcon />, route: "/addProduct" },
                { text: "Add New Comparison", icon: <AddBoxIcon />, route: "/addComparison" },
              ].map(({ text, icon, route }) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton onClick={() => handleMenuClick(route)} sx={{ "&:hover": { backgroundColor: "#e3f2fd" } }}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}

              {/* Admin Only Option */}
              {user && user.role === "admin" && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleMenuClick("/admin/product-types")}>
                  <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                  <ListItemText primary="Product Type" />
                </ListItemButton>
              </ListItem>
            )}
            </List>
          </Box>
        </Drawer>

        {/* App Logo & Title (Centered) */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, justifyContent: "center" }}>
          <img src={appLogo} alt="Comparathor Logo" width="48" height="48" />
          <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold", color: "white", letterSpacing: 1 }}>
            Comparathor
          </Typography>
        </Box>

        {/* User Menu (Right Side) */}
        <UserMenu username={user.user_id} setUser={setUser} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
