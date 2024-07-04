import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";

export const ScanLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Scan</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr]">
        <SideBar className="border-r border-black-200 pr-4" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};
