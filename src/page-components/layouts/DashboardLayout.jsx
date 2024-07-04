import React from "react";
import Head from "next/head";
import SideBar from "../components/Navbar/SideBar";
import RightBar from "../components/RightBar/RightBar";
import { RootLayout } from "./RootLayout";
import { Card, CardHeader } from "@/components/ui/card";
export const DashboardLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Dashboard</title>
      </Head>
      <div className="grid grid-cols-[auto,1fr] h-screen overflow-hidden">
        <SideBar className="border-r border-black-200 fixed pr-4 w-80" />
        <main className="flex p-6 overflow-y-auto">
            {children}
          {/* <Card className="w-1/3 h-1/3">
            <CardHeader>Events near me</CardHeader>
          </Card> */}
        </main>
      </div>
    </>
  );
};
