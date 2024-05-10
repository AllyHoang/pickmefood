import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar/NavbarRequest";

export const ActiveRequestLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Active Request</title>
      </Head>
      <Navbar />
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
