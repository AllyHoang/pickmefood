import React from "react";
import Head from "next/head";
import LandingPageNavbar from "../components/Navbar/LandingPageNavbar";

export const LandingPageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Home</title>
      </Head>
      <div>
        <main className="p-6">{children}</main>
      </div>
    </>
  );
};
