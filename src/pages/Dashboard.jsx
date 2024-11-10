// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { logout } from "../auth/firebaseAuth";
import { auth } from "../config/firebaseConfig";
import EventCalendar from "../components/EventCalendar";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Dashboard({ isDarkMode, handleThemeChange }) {
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <div>
      <AppBar
        sx={{ bgcolor: isDarkMode ? "#1e2b37" : "#3f51b5" }}
        position="static"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user ? user.displayName : "Guest"}!
          </Typography>

          <Box display="flex" alignItems="center">
            {/* Theme Toggle Icon */}
            <IconButton
              onClick={handleThemeChange}
              color="inherit"
              sx={{ mr: 2 }}
            >
              {isDarkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton onClick={handleAvatarClick}>
              <Avatar>{user?.displayName?.[0] || "U"}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, maxWidth: "800px", margin: "auto" }}>
        <EventCalendar />
      </Box>
    </div>
  );
}
