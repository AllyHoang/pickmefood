// src/layouts/EventLayout.jsx
import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";
import HorizontalBar from "../components/Navbar/HorizontalBar";

const EventLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Events</title>
      </Head>
      <div className=" grid grid-cols-[auto,1fr] h-screen overflow-hidden">
        <SideBar className="border-r border-black-200 fixed pr-4 w-80" />
        <div className="flex flex-col overflow-hidden">
          <div className="sticky min-w-0 h-20 shadow w-full top-0 z-50">
           
              <HorizontalBar></HorizontalBar>
            
          </div>
          <main className="flex flex-1 overflow-y-hidden mt-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default EventLayout;
