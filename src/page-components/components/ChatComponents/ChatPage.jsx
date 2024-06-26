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
    <div
      className="grid grid-cols-3 p-6 gap-6"
      style={{ background: "#edf2f7" }}
    >
      <div>
        <ChatList currentChatId={chatId} userId={userId} />
      </div>
      <div className="col-span-2">
        <ChatDetails userId={userId} chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatPage;
