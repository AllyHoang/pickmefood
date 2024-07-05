import * as React from "react";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons/fa

export const Message = ({ key, content, id, onDelete, userId, sender }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null); // State to store user info
  const [senderInfo, setSender] = useState(null);

  const isMine = sender?.userId === userId;

  useEffect(() => {
    // Function to fetch user info based on userId
    const fetchUserInfo = async () => {
      try {
        // Example fetch request to retrieve user data
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData.user); // Set user data in state
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    const fetchSenderInfo = async () => {
      try {
        // Example fetch request to retrieve user data
        const response = await fetch(`/api/users/${sender?.userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setSender(userData.user); // Set user data in state
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
    fetchSenderInfo();
  }, [userId, sender?.userId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch (e) {
      console.log(e);
      // handle the exceptions here...
    } finally {
      setIsDeleting(false);
    }
  };

  const backgroundColor = isMine ? "lightblue" : "white";
  const messageWidth = `${content.length * 50}px`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor,
        padding: 6,
        borderRadius: 10,
        margin: 10,
        maxWidth: "80%",
        width: messageWidth,
      }}
    >
      {/* Render profile image if user data is available */}
      {user && (
        <img
          src={senderInfo?.profileImage}
          alt={user.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            marginRight: 10,
          }}
        />
      )}
      <p style={{ flex: 1 }}>{content}</p>
      {isMine && (
        <FaTrash
          onClick={handleDelete}
          style={{
            cursor: "pointer",
            marginLeft: 10,
            color: "red",
            fontSize: "1.2rem",
          }}
        />
      )}
    </div>
  );
};
