import React from "react";
import Head from "next/head";

export const editItemLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Edit Donation</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
