import React from "react";
import Head from "next/head";
import LandingPageNavbar from "../components/Navbar/LandingPageNavbar";
import SideBar from "../components/Navbar/SideBar";

export const LandingPageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Home</title>
      </Head>
      <div>
        <SideBar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
