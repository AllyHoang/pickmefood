import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Chat from "./Chat";
import "tailwindcss/tailwind.css";

const Channel = ({ userId, eventName }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [roomIdentifier, setRoomIdentifier] = useState("");
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    const fetchEventsAndSetupChannel = async () => {
      try {
        const eventsResponse = await fetch(`/api/users/${userId}/events`);
        const events = await eventsResponse.json();

        const matchingEvent = events.events.find(
          (event) => event.eventName === eventName
        );

        setEventId(matchingEvent?._id);

        if (matchingEvent) {
          const cleanedEventName = eventName.replace(/\s/g, "");

          const channelResponse = await fetch("/api/channel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId: matchingEvent._id,
              eventName: cleanedEventName,
            }),
          });
          const channelData = await channelResponse.json();

          setVideoUrl(channelData.data.channelData.playbackUrl);
          setRoomIdentifier(channelData.data.chatData.roomIdentifier);
        } else {
          const eventsResponse = await fetch(`/api/eventName/${eventName}`);
          const event = await eventsResponse.json();

          setVideoUrl(event.event[0].channel[0].playbackUrl);
          setRoomIdentifier(event.event[0].chatRoom[0].roomIdentifier);
        }
      } catch (error) {
        console.error("Error fetching events or setting up channel:", error);
      }
    };

    fetchEventsAndSetupChannel();
  }, [userId, eventName]);

  return (
    <div className="overflow-hidden">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 relative">
          {videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              controls={true}
              width="100%"
              height="95%"
              className="absolute top-0 left-0"
            />
          ) : (
            <p className="flex justify-center items-center h-full text-white">
              Loading video...
            </p>
          )}
        </div>
        <div className="w-1/3 flex flex-col" style={{ height: "95vh" }}>
          <Chat
            roomIdentifier={roomIdentifier}
            userId={userId}
            eventId={eventId}
          />
        </div>
      </div>
    </div>
  );
};

export default Channel;
