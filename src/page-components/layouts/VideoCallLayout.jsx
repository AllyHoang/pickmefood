import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";

export const VideoCallLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Video Call</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr]">
        <SideBar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
