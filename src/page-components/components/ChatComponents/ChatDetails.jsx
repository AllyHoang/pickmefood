"use client";
import { Video, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Loader from "../Loader";
import Link from "next/link";
import { CldUploadButton } from "next-cloudinary";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { Card } from "@/components/ui/card";

const ChatDetails = ({ chatId, userId }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);
  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data.chat);
      setOtherMembers(
        data?.chat.members?.filter((member) => member._id !== userId)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId && chatId) getChatDetails();
  }, [userId, chatId]);

  const sendText = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: userId,
          text,
        }),
      });

      if (res.ok) {
        setText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendPhoto = async (result) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: userId,
          photo: result?.info?.secure_url,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  /* Scrolling down to the bottom when having the new message */

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  return loading ? (
    <Loader />
  ) : (
    <Card className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-row items-center gap-4 px-8 py-3 text-body-bold">
        {chat?.isGroup ? (
          <>
            <Link href={`/chats/${chatId}/group-info`}>
              <img
                src={chat?.groupPhoto || "/assets/group.png"}
                alt="group-photo"
                className="profilePhoto"
              />
            </Link>

            <div className="text">
              <p>
                {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                members
              </p>
            </div>
          </>
        ) : (
          <>
            <img
              src={otherMembers[0].profileImage || "/assets/person.jpg"}
              alt="profile photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0].username}</p>
            </div>
            <Link href={`/video-call?chatId=${chatId}`}>
              <Video size={23} style={{ marginLeft: "520px" }} />
            </Link>
          </>
        )}
      </div>

      <div className="chat-body">
        {chat?.messages?.map((message, index) => (
          <MessageBox key={index} message={message} currentUser={userId} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={sendPhoto}
            uploadPreset="zoa1vsa7"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              ></path>
            </svg>
          </CldUploadButton>

          <input
            type="text"
            placeholder="Write a message..."
            className="w-[670px] h-10 bg-transparent border rounded-xl pl-4 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div onClick={sendText}>
          {/* <img src="/assets/send.jpg" alt="send" className="send-icon" /> */}
          <svg
            class="w-7 h-7 transform rotate-45 -mt-px mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ChatDetails;
