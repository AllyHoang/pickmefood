import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";

export const TransactionLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Transaction</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr] h-screen overflow-hidden">
        <SideBar className="border-r border-black-200 fixed pr-4 w-80" />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};