"use client";
import dynamic from "next/dynamic";

const DynamicVideoUI = dynamic(() => import("./video-ui-kit"), { ssr: false });

export default function VideoCall({
  userId,
  email,
  firstname,
  lastname,
  chatId,
}) {
  return (
    <DynamicVideoUI
      userId={userId}
      email={email}
      firstname={firstname}
      lastname={lastname}
      chatId={chatId}
    />
  );
}
