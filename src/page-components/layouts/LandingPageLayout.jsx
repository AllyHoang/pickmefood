import React from "react";
import Head from "next/head";
import LandingPageNavbar from "../components/Navbar/LandingPageNavbar";
import GlobalNavbar from "../components/Navbar/GlobalNavbar";

export const LandingPageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Home</title>
      </Head>
      <div>
        <LandingPageNavbar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
