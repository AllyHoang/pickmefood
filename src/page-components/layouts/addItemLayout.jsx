import React from 'react';
import Head from 'next/head';
import AddItem from '../components/addItemForm/addItemForm';

export const addItemLayout = ({ children }) => {
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
