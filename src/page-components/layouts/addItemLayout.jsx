import React from "react";
import Head from "next/head";

export const AddItemLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Add Donation</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
