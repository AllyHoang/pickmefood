import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar/NavbarRequest";
import GlobalNavbar from "../components/Navbar/GlobalNavbar";

export const ActiveRequestLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Active Request</title>
      </Head>
      <Navbar />
      <div className="grid grid-cols-[auto,1fr]">
        <GlobalNavbar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
