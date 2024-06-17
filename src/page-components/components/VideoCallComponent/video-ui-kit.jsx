"use client";
import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { randomID } from "@/lib/utils";

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function App({ userId, email, firstname, lastname, chatId }) {
  const [roomID, setRoomID] = React.useState(
    getUrlParams().get("roomID") || randomID(5)
  );
  const myCallContainerRef = React.useRef(null);

  // Meeting initialization effect
  React.useEffect(() => {
    const initMeeting = async () => {
      if (myCallContainerRef.current) {
        const res = await fetch(`/api/zegocloud?userID=${userId}`);
        const { token, appID } = await res.json();

        const fullName = `${firstname} ${lastname}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          userId,
          email,
          fullName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: myCallContainerRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // Modify if needed for 1-on-1 calls
          },
        });
      }
    };

    initMeeting();
  }, [userId, email, firstname, lastname, roomID]);

  // Effect to send video link automatically after meeting initialization
  React.useEffect(() => {
    const sendVideoLink = async (chatId) => {
      try {
        const videoCallLink = `${window.location.protocol}//${window.location.host}/video-call?roomID=${roomID}`;

        const res = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            currentUserId: userId,
            text: `Join the video call here: ${videoCallLink}`,
          }),
        });

        if (res.ok) {
          console.log("Video link sent successfully");
        }
      } catch (err) {
        console.error("Error sending video link:", err);
      }
    };

    if (chatId) {
      sendVideoLink(chatId);
    }
  }, [chatId, roomID, userId]);

  return (
    <div
      className="myCallContainer"
      ref={myCallContainerRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
