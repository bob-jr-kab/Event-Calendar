import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, useMediaQuery, useTheme, Card } from "@mui/material";
import EventList from "./EventList";
import EventDetails from "./EventDetails";
import { fetchEvents } from "../functions/firebaseEvents";

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Set up theme and media query for responsive design
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };
    loadEvents();
  }, []);

  // Handle date click to select a day and display its events
  const handleDateClick = (arg) => {
    const date = arg.dateStr;
    setSelectedDate(date);
    const dayEvents = events.filter((event) => event.date === date);
    setSelectedDayEvents(dayEvents);
    setSelectedEvent(null); // Reset event selection when clicking a date
  };

  // Add an event and update the calendar display
  const handleAddEvent = async (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      { ...newEvent, start: newEvent.date },
    ]);
    setSelectedDayEvents((prevDayEvents) => [...prevDayEvents, newEvent]);
  };

  // Handle event click in calendar to display event details
  const handleEventClick = (clickedEvent) => {
    setSelectedEvent(clickedEvent);
  };

  // Function to update event in the local state after editing
  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setSelectedDayEvents((prevDayEvents) =>
      prevDayEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Function to delete an event from the local state after deletion
  const handleDeleteEvent = (deletedEventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId)
    );
    setSelectedDayEvents((prevDayEvents) =>
      prevDayEvents.filter((event) => event.id !== deletedEventId)
    );
    setSelectedEvent(null); // Go back to the event list after deletion
  };

  // Custom rendering to display green line for each event
  const renderEventContent = () => {
    return (
      <div
        style={{ borderTop: "3px solid green", marginTop: 2, width: "100%" }}
      />
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"} // Stack vertically on small screens
      gap={4}
      p={2}
    >
      {/* Calendar View */}
      <Box
        flex={2}
        sx={{
          overflow: "hidden",
          height: isSmallScreen ? "140px" : 470, // Set responsive height for calendar
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({
            title: event.title,
            date: event.date,
          }))}
          dateClick={handleDateClick}
          eventClick={(info) => handleEventClick(info.event.extendedProps)} // Pass event details
          dayMaxEventRows={5}
          height="auto"
          aspectRatio={1.5}
          eventContent={renderEventContent}
        />
      </Box>

      {/* Card Component to display EventList or EventDetails dynamically */}
      <Card
        sx={{
          flex: 1,
          p: 3,
          boxShadow: 3, // Adds shadow effect
          borderRadius: 2, // Adds rounded corners
          backgroundColor: theme.palette.background.default,
        }}
      >
        {selectedEvent ? (
          // Display EventDetails if an event is selected
          <EventDetails
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        ) : (
          // Display EventList if no event is selected
          <EventList
            selectedDate={selectedDate}
            events={selectedDayEvents}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
          />
        )}
      </Card>
    </Box>
  );
}
