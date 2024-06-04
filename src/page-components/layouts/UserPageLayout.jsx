import React from "react";
import Head from "next/head";

export const UserPageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | User Page</title>
      </Head>
      <main>{children}</main>
    </>
  );
};
