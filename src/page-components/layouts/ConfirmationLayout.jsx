import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";

export const ConfirmationLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Confirmation</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr]">
        <SideBar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
