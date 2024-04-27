import React from "react";
import Head from "next/head";
import GlobalNavbar from "../components/Navbar/GlobalNavbar";

export const HomeLayout = ({ children }) => {
  return (
    <>
      <GlobalNavbar></GlobalNavbar>
      <Head>
        <title>PickMeFood | Home</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
