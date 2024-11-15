import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Chip,
  useTheme,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import { addEvent } from "../functions/firebaseEvents"; // Import addEvent from firebaseEvents

export default function EventList({
  selectedDate,
  events,
  onAddEvent,
  onEventClick,
}) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventEmail, setEventEmail] = useState("");
  const [eventReminder, setEventReminder] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");

  const handleAddEventClick = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEventTitle("");
    setEventLocation("");
    setEventEmail("");
    setEventReminder("");
    setEventStartTime("");
    setEventEndTime("");
    setIsAllDay(false);
  };

  const handleEventAdd = async () => {
    if (eventTitle && selectedDate) {
      const newEvent = {
        title: eventTitle,
        date: selectedDate.toISOString(), // Store ISO string format for consistency
        location: eventLocation || "",
        email: eventEmail || "",
        startTime: isAllDay ? "All Day" : eventStartTime,
        endTime: isAllDay ? "All Day" : eventEndTime,
        reminder: eventReminder,
      };

      try {
        // Add event to Firestore
        const addedEvent = await addEvent(newEvent);
        onAddEvent(addedEvent); // Update parent state with the newly added event
      } catch (error) {
        console.error("Error adding event:", error);
      }

      handleDialogClose();
    }
  };

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), "EEEE, MMMM d")
    : "Select a Day";

  return (
    <Box>
      <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
        {formattedDate}
      </Typography>

      {selectedDate && (
        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
          <IconButton
            sx={{ color: theme.palette.primary.main }}
            onClick={handleAddEventClick}
          >
            <AddCircleIcon />
          </IconButton>
          <Typography color={theme.palette.text.primary} sx={{ ml: 0.5 }}>
            Add Event
          </Typography>
        </Box>
      )}

      <List>
        {events.length > 0 ? (
          events.map((event, index) => (
            <ListItem
              key={event.id || index}
              button
              onClick={() => onEventClick(event)}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={event.startTime || "All Day"}
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#424242" : "lightgrey",
                    color: theme.palette.text.primary,
                  }}
                />
                <ListItemText
                  primary={event.title}
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                  }}
                />
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color={theme.palette.text.secondary}>
            No events for this day.
          </Typography>
        )}
      </List>

      {/* Add Event Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: 1,
            maxHeight: "100%",
            overflow: "hidden",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 18, color: theme.palette.text.primary }}>
          Add New Event
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            fullWidth
            margin="dense"
            size="small"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <TextField
            label="Location"
            fullWidth
            margin="dense"
            size="small"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="dense"
            size="small"
            type="email"
            value={eventEmail}
            onChange={(e) => setEventEmail(e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            sx={{
              "& .MuiInputBase-root": { color: theme.palette.text.primary },
            }}
          />
          <FormControl fullWidth margin="dense">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  size="small"
                  sx={{ color: theme.palette.primary.main }}
                />
              }
              label="All Day"
              sx={{ color: theme.palette.text.primary }}
            />
          </FormControl>
          {!isAllDay && (
            <Box display="flex" gap={1} mb={1}>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                margin="dense"
                size="small"
                value={eventStartTime}
                onChange={(e) => setEventStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  style: { color: theme.palette.text.secondary },
                }}
                sx={{
                  "& .MuiInputBase-root": { color: theme.palette.text.primary },
                }}
              />
              <TextField
                label="End Time"
                type="time"
                fullWidth
                margin="dense"
                size="small"
                value={eventEndTime}
                onChange={(e) => setEventEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  style: { color: theme.palette.text.secondary },
                }}
                sx={{
                  "& .MuiInputBase-root": { color: theme.palette.text.primary },
                }}
              />
            </Box>
          )}
          <TextField
            label="Reminder"
            fullWidth
            margin="dense"
            size="small"
            select
            value={eventReminder}
            onChange={(e) => setEventReminder(e.target.value)}
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
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
            onClick={handleDialogClose}
            size="small"
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEventAdd}
            color="primary"
            variant="contained"
            size="small"
          >
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
