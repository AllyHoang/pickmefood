import React from "react";
import Head from "next/head";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Navbar/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ActiveDonationLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Active Donation</title>
      </Head>
      <Navbar />
      <div className="grid grid-cols-[auto,1fr]">
        <SideBar className="border-r border-black-200 pr-4" />
        <main className="p-6">{children}</main>
      </div>
      <ToastContainer />
    </>
  );
};
