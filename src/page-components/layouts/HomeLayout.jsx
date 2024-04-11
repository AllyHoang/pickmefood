import React from 'react';
import Head from 'next/head';

export const HomeLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Home</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};
