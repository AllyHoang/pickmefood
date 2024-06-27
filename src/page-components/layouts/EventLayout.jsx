// src/layouts/EventLayout.jsx
import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";

const EventLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Events</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr] h-screen overflow-hidden">
        <div className="sticky top-0 h-screen">
          <SideBar className="border-r border-black-200 pr-4 h-screen overflow-y-auto" />
        </div>
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default EventLayout;
