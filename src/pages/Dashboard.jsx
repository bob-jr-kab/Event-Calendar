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
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const navigate = useNavigate(); // React Router's navigation hook

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

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/setting"); // Navigate to the Settings route
  };

  return (
    <div style={{ backgroundColor: theme.palette.background.default }}>
      <AppBar
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "#6e6f6f" : "primary.main",
        }}
        position="static"
      >
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
              keepMounted
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          mt: 4,
          width: isSmallScreen ? "100%" : "90%",
          margin: "auto",
        }}
      >
        <EventCalendar />
      </Box>
    </div>
  );
}
