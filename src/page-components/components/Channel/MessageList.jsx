// MessageList.jsx

import * as React from "react";
import { Message } from "./Message";

export const MessageList = ({ messages, onDelete, userId }) => {
  console.log(messages);
  return (
    <>
      {messages.map((message) => (
        <Message
          sender={message.sender}
          key={message.id}
          onDelete={onDelete}
          content={message.content}
          id={message.id}
          userId={userId}
        />
      ))}
    </>
  );
};
