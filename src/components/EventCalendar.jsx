import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme, Card, Typography } from "@mui/material";
import Calendar from "react-calendar";
import EventList from "./EventList";
import EventDetails from "./EventDetails";
import { fetchEvents } from "../functions/firebaseEvents";
import "react-calendar/dist/Calendar.css";

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };
    loadEvents();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayEvents = events.filter(
      (event) =>
        new Date(event.date).toDateString() === new Date(date).toDateString()
    );
    setSelectedDayEvents(dayEvents);
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? "column" : isTablet ? "column" : "row"}
      gap={2}
      p={2}
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: isSmallScreen ? "500px" : "100vh",
        overflow: "auto",
      }}
    >
      {/* Calendar View */}
      <Box
        flex={2}
        sx={{
          p: 2,
          borderRadius: 2,
          height: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.paper,
          boxShadow: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: "bold",
          }}
        >
          Event Calendar
        </Typography>
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileClassName={({ date }) => {
            // Highlight selected date
            if (
              selectedDate &&
              date.toDateString() === selectedDate.toDateString()
            ) {
              return "react-calendar__tile--active"; // React Calendar default active class
            }
            return "";
          }}
          tileContent={({ date }) => {
            // Add a small dot for days with events
            const dayEvents = events.filter(
              (event) =>
                new Date(event.date).toDateString() === date.toDateString()
            );
            return dayEvents.length > 0 ? (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "50%",
                  margin: "auto",
                  marginTop: "4px",
                }}
              />
            ) : null;
          }}
          className="react-calendar"
          sx={{ backgroundColor: "green" }}
        />
      </Box>

      {/* Event Details or Event List */}
      <Card
        sx={{
          flex: 1,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          width: "100%", // Adjust width dynamically
          height: isSmallScreen ? "unset" : "500px", // Use auto height for small screens
          minHeight: isSmallScreen ? "200px" : "unset", // Set minHeight for small screens
          overflow: "auto",
        }}
      >
        {selectedEvent ? (
          <EventDetails
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onDeleteEvent={(id) => {
              setEvents(events.filter((event) => event.id !== id));
              setSelectedEvent(null);
            }}
            onUpdateEvent={(updatedEvent) => {
              setEvents((prevEvents) =>
                prevEvents.map((event) =>
                  event.id === updatedEvent.id ? updatedEvent : event
                )
              );
              setSelectedEvent(updatedEvent);
            }}
          />
        ) : (
          <EventList
            selectedDate={selectedDate}
            events={selectedDayEvents}
            onAddEvent={(newEvent) => {
              setEvents((prevEvents) => [...prevEvents, newEvent]);
              if (
                selectedDate &&
                new Date(newEvent.date).toDateString() ===
                  selectedDate.toDateString()
              ) {
                setSelectedDayEvents((prevDayEvents) => [
                  ...prevDayEvents,
                  newEvent,
                ]);
              }
            }}
            onEventClick={handleEventClick}
          />
        )}
      </Card>
    </Box>
  );
}
