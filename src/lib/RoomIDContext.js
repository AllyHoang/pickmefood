// RoomIDContext.js
import React, { createContext, useContext, useState } from "react";

const RoomIDContext = createContext();

export const useRoomID = () => useContext(RoomIDContext);

export const RoomIDProvider = ({ children }) => {
  const [roomID, setRoomID] = useState("");

  return (
    <RoomIDContext.Provider value={{ roomID, setRoomID }}>
      {children}
    </RoomIDContext.Provider>
  );
};
