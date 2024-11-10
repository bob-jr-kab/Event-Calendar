// src/components/EventCalendar.jsx

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Box, useMediaQuery, useTheme, Card } from "@mui/material";
import EventList from "./EventList";
import EventDetails from "./EventDetails";
import { fetchEvents } from "../functions/firebaseEvents";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US"; // Import the locale directly
import "react-big-calendar/lib/css/react-big-calendar.css";

// Date-fns localization setup with ES6 imports
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
      (event) => new Date(event.date).toDateString() === date.toDateString()
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
      flexDirection={isSmallScreen ? "column" : "row"}
      gap={2}
      p={2}
    >
      <Box
        flex={2}
        sx={{
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Calendar
          localizer={localizer}
          events={events.map((event) => ({
            ...event,
            start: new Date(event.date),
            end: new Date(event.date),
          }))}
          defaultView="month"
          style={{ height: "100%", padding: "1em", width: "auto" }}
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          selectable
          onSelectEvent={(event) => handleEventClick(event)}
        />
      </Box>

      <Card
        sx={{
          flex: 1,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
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
