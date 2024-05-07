import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar/NavbarRequest";

export const DashboardLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Active Request</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
