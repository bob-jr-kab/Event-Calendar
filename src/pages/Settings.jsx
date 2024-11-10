import React, { useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";

const db = getFirestore();

export default function Settings() {
  const user = auth.currentUser;
  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      const loadUserInfo = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || user.displayName);
          setEmail(userData.email || user.email);
        }
      };
      loadUserInfo();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    if (!username || !email) {
      setError("Username and email are required.");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (username !== user.displayName) {
        await updateProfile(user, { displayName: username });
        await updateDoc(doc(db, "users", user.uid), { username });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
        await updateDoc(doc(db, "users", user.uid), { email });
      }

      if (password) {
        await updatePassword(user, password);
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          User Settings
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Update Username */}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Update Email */}
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Update Password */}
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleUpdateProfile}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}
