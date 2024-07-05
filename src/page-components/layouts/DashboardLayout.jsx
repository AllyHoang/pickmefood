import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";
import HorizontalBar from "../components/Navbar/HorizontalBar";
export const DashboardLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Dashboard</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr] h-screen overflow-hidden ">
        <SideBar className="border-r border-black-200 fixed pr-4 w-80" />
        <div className="flex flex-col overflow-hidden">
          <div className="sticky min-w-0 h-20 shadow w-full top-0 z-50">
            <div className="base-container">
              <HorizontalBar></HorizontalBar>
            </div>
          </div>
          <main className="flex overflow-y-scroll flex-1 base-container hide-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
