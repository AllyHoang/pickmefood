"use client";

import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Loader from "../Loader";
import { pusherClient } from "@/lib/pusher";

const ChatList = ({ currentChatId, userId }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${userId}/searchChat/${search}`
          : `/api/users/${userId}`
      );
      const data = await res.json();

      if (search !== "") {
        console.log(data.searchedChat);
        setChats(data.searchedChat);
      } else {
        console.log(data.allChats);
        setChats(data.allChats);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      getChats();
    }
  }, [userId, search]);

  useEffect(() => {
    if (userId) {
      pusherClient.subscribe(userId);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(userId);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            chat={chat}
            index={index}
            currentUser={userId}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
