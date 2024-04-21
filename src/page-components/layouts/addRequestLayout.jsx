import React from "react";
import Head from "next/head";

export const AddRequestLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Add Requests</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};