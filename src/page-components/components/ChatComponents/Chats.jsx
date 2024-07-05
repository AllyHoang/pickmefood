import React, { useState } from "react";
import Contacts from "./Contacts";
import ChatList from "./ChatList";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Chats = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div style={{ background: "#edf2f7" }}>
      <div className="flex flex-wrap w-full h-screen p-4">
        <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
          <ChatList userId={userId} onSelectChat={handleChatSelect} />
        </div>
        <div className="w-2/3 max-lg:w-1/2 max-md:hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Dialog>
              <DialogTrigger className="ml-auto">
                {" "}
                {/* Added ml-auto class */}
                <Button className="bg-indigo-200">Create a group</Button>
              </DialogTrigger>
              <DialogContent className="min-w-fit w-3/4 h-4/5">
                <Contacts userId={userId} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
