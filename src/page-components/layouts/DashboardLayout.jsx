import React from "react";
import Head from "next/head";
import GlobalNavbar from "../components/Navbar/GlobalNavbar";

export const DashboardLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Dashboard</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr] h-screen overflow-hidden">
        <GlobalNavbar className="border-r border-black-200 fixed pr-4 w-80" />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};
