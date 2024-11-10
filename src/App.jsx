// src/App.jsx
import React, { useEffect, useState } from "react";
import { auth } from "./config/firebaseConfig";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Settings from "./pages/Settings";
import { ThemeProvider, CssBaseline, IconButton, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        {/* Global App Bar for Theme Toggle */}
        <Box
          sx={{
            position: "fixed",
            bottom: 20, // Adjust spacing from the bottom
            right: 25, // Adjust spacing from the right
            zIndex: 1000, // Ensure it stays on top of other elements
            bgcolor: isDarkMode ? "grey.900" : "grey.200",
            borderRadius: "50%", // Make it circular
            boxShadow: 3, // Add shadow for better visibility
            p: 1,
          }}
        >
          <IconButton onClick={handleThemeChange} color="inherit">
            {isDarkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" /> : <Signup />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/setting" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
