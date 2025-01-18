import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import appLogo from "../assets/app-logo.svg";
import { deepPurple } from "@mui/material/colors";
import routes from "../routes/routes"; // Import routes configuration

function Header({ username }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* App Icon and Name */}
        <Box display="flex" alignItems="center" flexGrow={1}>
          <IconButton edge="start" color="inherit" aria-label="app logo">
            <img src={appLogo} alt="App Logo" width="40" height="40" />
          </IconButton>
          <Typography variant="h6" component="div">
            COMPARATHOR
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box>
          {routes.map(({ path }) => (
            <Button
              key={path}
              color="inherit"
              component={NavLink}
              to={path}
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? "yellow" : "white",
              })}
            >
              {path === "/" ? "Dashboard" : path.replace("/", "").replace(/([A-Z])/g, " $1").toUpperCase()}
            </Button>
          ))}
        </Box>

        {/* User Icon and Name */}
        <Box display="flex" alignItems="center" marginLeft={2}>
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
