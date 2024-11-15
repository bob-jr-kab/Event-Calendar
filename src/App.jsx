import React, { useEffect, useState } from "react";
import { auth } from "./config/firebaseConfig.jsx";
import { logout } from "./auth/firebaseAuth.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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

  // Automatically logout after inactivity
  useEffect(() => {
    const logoutAfterInactivity = () => {
      logout();
      setUser(null); // Update local state after logout
    };

    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutAfterInactivity, 15 * 60 * 1000); // 15 minutes
    };

    const activityEvents = ["mousemove", "keypress", "scroll", "click"];

    // Add event listeners to reset the timer
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer(); // Start timer on mount

    // Cleanup event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
    };
  }, []);

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
        {/* Theme Toggle Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 25,
            zIndex: 1000,
            bgcolor: isDarkMode ? "grey.900" : "grey.200",
            borderRadius: "50%",
            boxShadow: 3,
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
