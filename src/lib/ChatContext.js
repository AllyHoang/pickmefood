// ChatContext.js
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatLive, setIsChatLive] = useState(false);
  const [eventId, setEventId] = useState("");

  return (
    <ChatContext.Provider
      value={{ isChatLive, setIsChatLive, eventId, setEventId }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
