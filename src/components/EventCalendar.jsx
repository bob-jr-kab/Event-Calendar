import React, { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Card,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

  // Styled Calendar
  const StyledCalendar = styled(Calendar)(({ theme }) => ({
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "12px",
    padding: "16px",
    width: "100%",
    "& .react-calendar__navigation": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      fontWeight: "bold",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    "& .react-calendar__navigation button": {
      color: theme.palette.text.primary,
      fontSize: "1rem",
      fontWeight: "bold",
      background: "none",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
        borderRadius: "4px",
      },
    },
    "& .react-calendar__tile": {
      color: theme.palette.text.primary,
      fontWeight: "bold",
      fontSize: "0.9rem",
      alignItems: "center",
      justifyContent: "center",
      height: "70px",
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
      },
    },
    "& .react-calendar__tile--now": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.secondary.dark
          : theme.palette.secondary.light,
      borderRadius: "8px",
      color: theme.palette.secondary.contrastText,
    },
    "& .react-calendar__tile--active": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: "8px",
    },
    "& .react-calendar__month-view__days__day--neighboringMonth": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.grey[500]
          : theme.palette.grey[600],
    },
  }));

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

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          pt: 2,
          pl: 4,
        }}
      >
        <Button variant="outlined" color="primary" onClick={handleTodayClick}>
          Today
        </Button>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: theme.palette.info.main,
            fontWeight: 100,
            flexGrow: 1,
          }}
        >
          Event Calendar
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : isTablet ? "column" : "row"}
        gap={2}
        p={2}
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          overflow: "auto",
        }}
      >
        {/* Calendar View */}
        <Box
          flex={2}
          sx={{
            borderRadius: 2,
            height: "100%",
            width: isSmallScreen ? "100%" : isTablet ? "100%" : "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            boxShadow: "3",
          }}
        >
          <StyledCalendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={({ date }) => {
              if (
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()
              ) {
                return "react-calendar__tile--active";
              }
              if (date.toDateString() === new Date().toDateString()) {
                return "react-calendar__tile--now";
              }
              return "";
            }}
            tileContent={({ date }) => {
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
          />
        </Box>

        {/* Event Details or Event List */}
        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            boxShadow: "3",
            width: isSmallScreen ? "100%" : isTablet ? "100%" : "100%",
            height: isSmallScreen ? "unset" : "auto",
            minHeight: isSmallScreen ? "200px" : "unset",
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
    </Box>
  );
}
