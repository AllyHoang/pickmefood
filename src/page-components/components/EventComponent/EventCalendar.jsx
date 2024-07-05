import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Optional: for drag and drop functionality
import EventCard from "./EventCard"; // Ensure the path is correct
import { useWindowSize } from "@/hook/useWindowSize"; // Importing a custom hook to get window size

const CalendarComponent = ({ events, userId }) => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef(null);
  const windowSize = useWindowSize();

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();

    // Get the event's bounding rectangle
    const rect = info.el.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();

    // Set the position of the popup relative to the calendar container
    setClickPosition({
      top: rect.top - calendarRect.top + rect.height,
      left: Math.min(
        rect.left - calendarRect.left,
        windowSize.width - 320 // Ensure popup doesn't overflow window width
      ),
    });

    // Toggle event detail display
    setExpandedEvent(
      expandedEvent && expandedEvent.id === info.event.id ? null : info.event
    );
  };

  const renderEventContent = (eventInfo) => (
    <div className="p-1 text-left cursor-pointer">
      <span className="font-bold">{eventInfo.timeText}</span> <br />
      <span className="italic">{eventInfo.event.title}</span>
    </div>
  );

  return (
    <div className="relative" ref={calendarRef}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        contentHeight="auto"
        height="auto"
      />
      {expandedEvent && (
        <div
          className="absolute z-50 p-4 bg-white shadow-lg rounded-md w-80 border border-gray-200"
          style={{
            top: clickPosition.top + 10, // Add a small offset for better appearance
            left: clickPosition.left,
          }}
        >
          <EventCard event={expandedEvent.extendedProps} userId={userId} />
        </div>
      )}
    </div>
  );
};

const Calendar = ({ userId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        const events = data.events;

        // Ensure the events are in the correct format
        const formattedEvents = events.map((event) => ({
          ...event,
          id: event._id, // Ensure each event has an `id` property
          title: event.eventName,
          start: event.expirationDate,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarComponent events={events} userId={userId} />
    </div>
  );
};

export default Calendar;
