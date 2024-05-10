import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ActiveDonationLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Active Donation</title>
      </Head>
      <Navbar />
      <main>
        <div>{children}</div>
      </main>
      <ToastContainer />
    </>
  );
};
