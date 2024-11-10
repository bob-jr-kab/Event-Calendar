// theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0f0f0", // Light background color
      paper: "#ffffff", // Light paper color
    },
    text: {
      primary: "#000000",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background color
      paper: "#1e1e1e", // Dark paper color
    },
    text: {
      primary: "#ffffff",
    },
  },
});
