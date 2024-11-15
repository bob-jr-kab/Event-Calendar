// components/EventDetails
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  MenuItem,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EventIcon from "@mui/icons-material/Event";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { updateEvent, deleteEvent } from "../functions/firebaseEvents";

export default function EventDetails({
  event,
  onBack,
  onDeleteEvent,
  onUpdateEvent,
}) {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleEditOpen = () => setEditDialogOpen(true);
  const handleEditClose = () => setEditDialogOpen(false);

  const handleDelete = async () => {
    await deleteEvent(event.id);
    onDeleteEvent(event.id);
    onBack();
  };

  const handleSaveEdit = async () => {
    try {
      if (!event.id) {
        console.error("Event ID is undefined");
        return;
      }
      await updateEvent(event.id, editedEvent);
      onUpdateEvent(editedEvent);
      setEditedEvent(editedEvent);
      handleEditClose();
    } catch (error) {
      console.error("Error in handleSaveEdit: ", error);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedEvent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 2,
        height: "100%",
      }}
    >
      {/* Header with back button and title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          onClick={onBack}
          size="small"
          sx={{ color: theme.palette.text.primary }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          component="div"
          fontWeight="bold"
          color={theme.palette.text.primary}
        >
          Event Details
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

      {/* Event Details with Icons */}
      <Box sx={{ pl: 2 }}>
        {editedEvent.title && (
          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon sx={{ mr: 1, color: theme.palette.action.active }} />
            <Typography variant="body1" color={theme.palette.text.primary}>
              {editedEvent.title}
            </Typography>
          </Box>
        )}
        {(editedEvent.startTime || editedEvent.endTime) && (
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTimeIcon
              sx={{ mr: 1, color: theme.palette.action.active }}
            />
            <Box display="flex" flexDirection="column">
              {editedEvent.startTime && (
                <Typography variant="body2" color={theme.palette.text.primary}>
                  Start: {editedEvent.startTime}
                </Typography>
              )}
              {editedEvent.endTime && (
                <Typography variant="body2" color={theme.palette.text.primary}>
                  End: {editedEvent.endTime}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {editedEvent.location && (
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOnIcon
              sx={{ mr: 1, color: theme.palette.action.active }}
            />
            <Typography variant="body1" color={theme.palette.text.primary}>
              {editedEvent.location}
            </Typography>
          </Box>
        )}
        {editedEvent.email && (
          <Box display="flex" alignItems="center" mb={1}>
            <EmailIcon sx={{ mr: 1, color: theme.palette.action.active }} />
            <Typography variant="body1" color={theme.palette.text.primary}>
              {editedEvent.email}
            </Typography>
          </Box>
        )}
        {editedEvent.reminder && (
          <Box display="flex" alignItems="center" mb={1}>
            <NotificationsIcon
              sx={{ mr: 1, color: theme.palette.action.active }}
            />
            <Typography variant="body1" color={theme.palette.text.primary}>
              {editedEvent.reminder}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="right">
        <IconButton
          sx={{ color: theme.palette.primary.main }}
          onClick={handleEditOpen}
        >
          <EditCalendarIcon />
        </IconButton>
        <IconButton
          sx={{ color: theme.palette.error.main }}
          onClick={handleDelete}
        >
          <HighlightOffIcon />
        </IconButton>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: 1,
            maxWidth: "400px",
            maxHeight: "500px",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          Edit Event
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            fullWidth
            size="small"
            margin="dense"
            value={editedEvent.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <TextField
            label="Location"
            fullWidth
            size="small"
            margin="dense"
            value={editedEvent.location || ""}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <TextField
            label="Email Address"
            fullWidth
            size="small"
            margin="dense"
            type="email"
            value={editedEvent.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Start Time"
              type="time"
              size="small"
              fullWidth
              margin="dense"
              value={editedEvent.startTime || ""}
              onChange={(e) => handleFieldChange("startTime", e.target.value)}
              InputLabelProps={{
                shrink: true,
                style: { color: theme.palette.text.primary },
              }}
              sx={{
                "& .MuiInputBase-root": { color: theme.palette.text.primary },
              }}
            />
            <TextField
              label="End Time"
              type="time"
              fullWidth
              size="small"
              margin="dense"
              value={editedEvent.endTime || ""}
              onChange={(e) => handleFieldChange("endTime", e.target.value)}
              InputLabelProps={{
                shrink: true,
                style: { color: theme.palette.text.primary },
              }}
              sx={{
                "& .MuiInputBase-root": { color: theme.palette.text.primary },
              }}
            />
          </Box>
          <TextField
            label="Reminder"
            fullWidth
            margin="dense"
            size="small"
            select
            value={editedEvent.reminder || ""}
            onChange={(e) => handleFieldChange("reminder", e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          >
            <MenuItem value="At the time of the event">
              At the time of the event
            </MenuItem>
            <MenuItem value="1 hour before">1 hour before</MenuItem>
            <MenuItem value="10 minutes before">10 minutes before</MenuItem>
            <MenuItem value="1 day before">1 day before</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            size="small"
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="primary"
            variant="contained"
            size="small"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
