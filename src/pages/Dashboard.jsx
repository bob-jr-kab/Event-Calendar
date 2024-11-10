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
  useMediaQuery,
  IconButton,
} from "@mui/material";

export default function Dashboard() {
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
      <AppBar sx={{ bgcolor: "primary.main" }} position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user ? user.displayName : "Guest"}!
          </Typography>

          <Box display="flex" alignItems="center">
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

      <Box
        sx={{
          mt: 4,
          width: isSmallScreen ? "100%" : "80%",
          margin: "auto",
        }}
      >
        <EventCalendar />
      </Box>
    </div>
  );
}
