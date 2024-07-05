import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { useRouter } from "next/router";
import { useChat } from "@/lib/ChatContext";
import Calendar from "./EventCalendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EventPage = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4; // Number of events per page
  const { isChatLive, eventId } = useChat();

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Loading events...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Error loading events: {error}
        </h2>
      </div>
    );
  }

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <div className="base-container flex flex-col overflow-y-scroll">
      {/* Sticky header */}
    
      <div className="sticky bg-white z-50 shadow-md">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <span className="text-heading2-bold font-bold text-gray-800">
            Upcoming Events
          </span>
          <div className="flex space-x-4">
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:shadow-outline text-sm"
              onClick={() => router.push("/add-event")}
            >
              Add New Event
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:shadow-outline text-sm"
              onClick={() => router.push("/my-event")}
            >
              My Events
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-grow overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="container mx-auto py-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentEvents.map((event) => (
              <div key={event._id} className="w-full">
                <EventCard
                  event={event}
                  userId={userId}
                  currentEventId={eventId}
                  isChatLive={isChatLive}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              className={`${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r focus:outline-none ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
