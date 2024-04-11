import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar/Navbar';
import ItemList from '../components/ItemList/ItemList';

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
    </>
  );
};
