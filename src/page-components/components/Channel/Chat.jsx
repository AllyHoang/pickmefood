import React, { useEffect, useState } from "react";
import {
  ChatRoom,
  SendMessageRequest,
  DeleteMessageRequest,
} from "amazon-ivs-chat-messaging";
import { SendButton } from "./SendButton";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { fetchChatToken } from "./fetchChatToken";
import { Card } from "@/components/ui/card";
import { useChat } from "@/lib/ChatContext";

const Chat = ({ roomIdentifier, userId, eventId }) => {
  const { setIsChatLive, setEventId } = useChat();
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [connectionState, setConnectionState] = useState("disconnected");

  const chatRoomUrl = "wss://edge.ivschat.us-east-1.amazonaws.com";

  const [room] = useState(
    () =>
      new ChatRoom({
        regionOrUrl: chatRoomUrl,
        tokenProvider: () => fetchChatToken(userId, roomIdentifier),
      })
  );

  const onMessageSend = async () => {
    const request = new SendMessageRequest(messageToSend);
    setIsSending(true);
    setMessageToSend("");

    try {
      await room.sendMessage(request);
    } catch (e) {
      console.log("Send message error:", e);
    } finally {
      setIsSending(false);
    }
  };

  const isSendDisabled = connectionState !== "connected" || isSending;

  const onDeleteMessage = async (id) => {
    const request = new DeleteMessageRequest(id);
    try {
      await room.deleteMessage(request);
    } catch (e) {
      console.log("Delete message error:", e);
    }
  };

  useEffect(() => {
    const unsubscribeOnConnected = room.addListener("connect", () => {
      console.log("Connected to chat room");
      setConnectionState("connected");
      setIsChatLive(true);
      setEventId(eventId);
    });

    const unsubscribeOnDisconnected = room.addListener("disconnect", () => {
      console.log("Disconnected from chat room");
      setConnectionState("disconnected");
      setIsChatLive(false);
    });

    const unsubscribeOnError = room.addListener("error", (error) => {
      console.error("Connection error:", error);
    });

    const unsubscribeOnMessageReceived = room.addListener(
      "message",
      (message) => {
        setMessages((msgs) => [...msgs, message]);
      }
    );

    const unsubscribeOnMessageDeleted = room.addListener(
      "messageDelete",
      (deleteMessageEvent) => {
        setMessages((prev) =>
          prev.filter((message) => message.id !== deleteMessageEvent.id)
        );
      }
    );

    room.connect();

    return () => {
      unsubscribeOnConnected();
      unsubscribeOnDisconnected();
      unsubscribeOnError();
      unsubscribeOnMessageReceived();
      unsubscribeOnMessageDeleted();
      room.disconnect();
    };
  }, [room, setIsChatLive, setEventId]);

  return (
    <div className="flex h-full bg-gray-100">
      <Card className="flex flex-col flex-grow h-full overflow-hidden relative bg-gray-100">
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-250 p-4"></div>
        <div className="flex-grow overflow-y-auto mb-2 bg-gray-100 rounded-lg p-4">
          <MessageList
            onDelete={onDeleteMessage}
            messages={messages}
            userId={userId}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-grey-250 p-4">
          <div className="flex items-center space-x-4">
            <MessageInput
              value={messageToSend}
              onMessageChange={setMessageToSend}
              placeholder="Type your message..."
              className="flex-grow rounded-l-lg py-2 px-4 bg-gray-100 focus:outline-none focus:ring focus:border-blue-300"
            />
            <SendButton
              disabled={isSendDisabled}
              onPress={onMessageSend}
              className="rounded-r-lg py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
