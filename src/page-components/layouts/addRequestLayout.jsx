import React from 'react';
import Head from 'next/head';
import AddRequest from '../components/addRequestForm/addRequestForm';

export const AddRequestLayout= ({ children }) => {
  return (
    <>
      <Head>
        <title>PickMeFood | Add Requests</title>
        <title>PickMeFood | Add Requests</title>
      </Head>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
};