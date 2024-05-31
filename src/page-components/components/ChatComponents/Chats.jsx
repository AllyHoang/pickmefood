import React from "react";
import Contacts from "./Contacts";
import ChatList from "./ChatList";

const Chats = ({ userId }) => {
  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList userId={userId} />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:hidden overflow-hidden">
        <Contacts userId={userId} />
      </div>
    </div>
  );
};

export default Chats;
