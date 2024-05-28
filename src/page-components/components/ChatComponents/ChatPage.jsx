"use client";
import ChatDetails from "./ChatDetails";
import ChatList from "./ChatList";
import { useEffect } from "react";

const ChatPage = ({ userId, chatId }) => {
  const seenMessages = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: userId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId && chatId) seenMessages();
  }, [userId, chatId]);

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} userId={userId} />
      </div>
      <div
        className="w-2/3 max-lg:w-full overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <ChatDetails userId={userId} chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatPage;
